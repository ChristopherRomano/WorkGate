
import { employeeLeaveRequests } from '../data/mockData';
import { useState, useEffect, useMemo } from 'react';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './LeaveApproval.module.css';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfWeek(year, month) { return (new Date(year, month, 1).getDay() + 6) % 7; }
function parseDate(dateStr) {
  if (!dateStr) return null;
  
  // Try different date formats
  const formats = [
    // DD MMM YYYY (e.g., "20 Apr 2026")
    /^(\d{1,2}) (\w{3}) (\d{4})$/,
    // YYYY-MM-DD (e.g., "2026-04-20")
    /^(\d{4})-(\d{2})-(\d{2})$/,
    // MM/DD/YYYY (e.g., "04/20/2026")
    /^(\d{2})\/(\d{2})\/(\d{4})$/
  ];
  
  for (const format of formats) {
    const match = dateStr.match(format);
    if (match) {
      if (format === formats[0]) {
        // DD MMM YYYY -> MMM DD, YYYY
        return new Date(`${match[2]} ${match[1]}, ${match[3]}`);
      } else if (format === formats[1]) {
        // YYYY-MM-DD
        return new Date(match[1], match[2] - 1, match[3]);
      } else if (format === formats[2]) {
        // MM/DD/YYYY
        return new Date(match[3], match[1] - 1, match[2]);
      }
    }
  }
  
  // Fallback: try direct parsing
  return new Date(dateStr);
}


export default function LeaveApproval() {
  console.log('LeaveApproval component rendering');

  const [requests, setRequests] = useState(employeeLeaveRequests);
  const [filter, setFilter] = useState('pending');
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectComment, setRejectComment] = useState('');
  const [calDate, setCalDate] = useState(new Date(2026, 3)); // April 2026


  const fetchLeaveRequests = async () => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/annualLeave?Username=john"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch leave requests");
    }

    const data = await response.json();

    console.log(data);
    
    const formatted = data.map((item, index) => ({
      id: index,

      employee: item.username ?? item.name ?? "Unknown",
      type: "Annual Leave",

      start: item.start ?? item.startDate ?? "",
      end: item.end ?? item.endDate ?? "",

      days: 1,
      reason: item.reason ?? "",

      status: "pending",
      comment: ""
    }));

    setRequests(formatted);

  } catch (error) {
    console.error("API fetch failed, falling back to mock data:", error);
    // Fall back to mock data if API fails
    setRequests(employeeLeaveRequests);
  }
  };

  // useEffect(() => {
  //   console.log('useEffect running, fetching leave requests');
  //   fetchLeaveRequests();
  // }, []);

  const approve = (id) =>
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved', comment: '' } : r));

  const openReject = (request) => { setRejectTarget(request); setRejectComment(''); };

  const confirmReject = () => {
    if (!rejectComment.trim()) return;
    setRequests(prev => prev.map(r => r.id === rejectTarget.id ? { ...r, status: 'rejected', comment: rejectComment.trim() } : r));
    setRejectTarget(null);
    setRejectComment('');
  };

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);
  const pendingCount = requests.filter(r => r.status === 'pending').length;

  // Calendar logic for approved leaves
  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOffset = getFirstDayOfWeek(year, month);

  const approvedLeavesByDay = useMemo(() => {
    const map = {};
    requests.filter(r => r.status === 'approved').forEach(leave => {
      const startDate = parseDate(leave.start);
      const endDate = parseDate(leave.end);
      
      if (startDate && endDate && !isNaN(startDate) && !isNaN(endDate)) {
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          if (!map[dateStr]) map[dateStr] = [];
          map[dateStr].push(leave.employee);
        }
      }
    });
    return map;
  }, [requests]);

  // Log entries for approved and rejected requests
  const logEntries = useMemo(() => {
    return [...requests.filter(r => r.status === 'approved' || r.status === 'rejected')]
      .sort((a, b) => {
        const dateA = parseDate(a.start);
        const dateB = parseDate(b.start);
        return dateB - dateA; // Most recent first
      });
  }, [requests]);

  return (
    <div className="animate-fade">
      <div className={styles.filters}>
        {[['pending', `Pending${pendingCount ? ` (${pendingCount})` : ''}`], ['approved', 'Approved'], ['rejected', 'Rejected'], ['all', 'All']].map(([val, label]) => (
          <button key={val} className={`btn ${filter === val ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setFilter(val)}>{label}</button>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Employee Leave Requests</span>
        </div>
        <div className={styles.listBody}>
          {filtered.length === 0 && <div className={styles.empty}>No requests found.</div>}
          {filtered.map(req => (
            <div key={req.id} className={styles.requestRow}>
              <div className={styles.avatar}>{req.initials || req.employee.split(' ').map(n => n[0]).join('')}</div>
              <div className={styles.info}>
                <div className={styles.employeeName}>{req.employee}</div>
                <div className={styles.meta}>
                  {req.type} · {req.start}{req.start !== req.end ? ` – ${req.end}` : ''} · <strong className={styles.metaStrong}>{req.days} day{req.days !== 1 ? 's' : ''}</strong>
                </div>
                {req.reason && <div className={styles.reason}>"{req.reason}"</div>}
                {req.status === 'rejected' && req.comment && (
                  <div className={styles.rejectReason}>Reason: {req.comment}</div>
                )}
              </div>
              {req.status === 'pending' ? (
                <div className={styles.actions}>
                  <button className="btn btn-primary btn-sm" onClick={() => approve(req.id)}>Approve</button>
                  <button className={`btn btn-ghost btn-sm ${styles.rejectBtn}`} onClick={() => openReject(req)}>Reject</button>
                </div>
              ) : (
                <span className={`badge badge-${req.status === 'approved' ? 'approved' : 'rejected'}`}>
                  {req.status.toUpperCase()}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className={styles.calHeader}>
          <button className="btn btn-ghost btn-sm" onClick={() => setCalDate(new Date(year, month - 1))}>‹</button>
          <span className={styles.calTitle}>{MONTHS[month]} {year}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setCalDate(new Date(year, month + 1))}>›</button>
        </div>
        <div className={styles.calGrid}>
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
            <div key={d} className={styles.calDayName}>{d}</div>
          ))}
          {Array.from({ length: firstDayOffset }, (_, i) => <div key={`blank-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const employees = approvedLeavesByDay[dateStr] || [];
            const hasApproved = employees.length > 0;
            return (
              <div
                key={day}
                className={[
                  styles.calDay,
                  hasApproved ? styles.calDayHasItems : '',
                ].join(' ')}
              >
                <span className={styles.calDayNum}>{day}</span>
                {hasApproved && (
                  <div className={styles.calDots}>
                    <span className={styles.dotApproved} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Log Section */}
      <div className={`card ${styles.logSection}`}>
        <div className="card-header">
          <span className="card-title">Request Log</span>
          <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--mono)' }}>
            {logEntries.length} entries
          </span>
        </div>
        <div className={styles.logList}>
          {logEntries.length === 0 && <div className={styles.empty}>No logged requests yet.</div>}
          {logEntries.map(entry => (
            <div key={entry.id} className={styles.logEntry}>
              <div className={`${styles.logIcon} ${entry.status === 'approved' ? styles.logIconApproved : styles.logIconRejected}`}>
                {entry.status === 'approved' ? '✓' : '✗'}
              </div>
              <div className={styles.logContent}>
                <div className={styles.logTitle}>
                  {entry.employee} - {entry.type}
                </div>
                <div className={styles.logMeta}>
                  {entry.start}{entry.start !== entry.end ? ` – ${entry.end}` : ''} · {entry.days} day{entry.days !== 1 ? 's' : ''}
                </div>
                {entry.comment && (
                  <div className={styles.logComment}>
                    {entry.status === 'rejected' ? `Rejected: ${entry.comment}` : entry.comment}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject Leave Request">
        <div className="form-grid">
          {rejectTarget && (
            <div className={styles.rejectSummary}>
              <strong>{rejectTarget.employee}</strong> — {rejectTarget.type}<br />
              <span className={styles.rejectSummaryMeta}>
                {rejectTarget.start}{rejectTarget.start !== rejectTarget.end ? ` – ${rejectTarget.end}` : ''} · {rejectTarget.days} day{rejectTarget.days !== 1 ? 's' : ''}
              </span>
            </div>
          )}
          <div className="form-group">
            <label>Reason for Rejection <span className={styles.requiredStar}>*</span></label>
            <textarea
              className="field"
              style={{ minHeight: 90 }}
              placeholder="Provide a reason — this will be visible to the employee..."
              value={rejectComment}
              onChange={e => setRejectComment(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button className={`btn btn-primary ${styles.confirmRejectBtn}`} onClick={confirmReject} disabled={!rejectComment.trim()}>Confirm Rejection</button>
            <button className="btn btn-ghost" onClick={() => setRejectTarget(null)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
