import { useState } from 'react';
import { timesheetData } from '../data/mockData';
import '../styles/components.css';
import styles from './Timesheet.module.css';

export default function Timesheet() {
  const [rows, setRows] = useState(timesheetData.rows.map(r => ({ ...r, hours: [...r.hours] })));
  const [status, setStatus] = useState('draft');

  const setHour = (rIdx, dIdx, val) => {
    setRows(prev => {
      const next = prev.map(r => ({ ...r, hours: [...r.hours] }));
      next[rIdx].hours[dIdx] = parseFloat(val) || 0;
      return next;
    });
  };

  const dailyTotals = timesheetData.days.map((_, di) =>
    rows.reduce((sum, r) => sum + (r.hours[di] || 0), 0)
  );
  const weekTotal = dailyTotals.reduce((a, b) => a + b, 0);

  return (
    <div className="animate-fade">
      <div className={styles.header}>
        <div>
          <p className="section-title">{timesheetData.weekLabel}</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Client Project: <strong style={{ color: 'var(--lime)' }}>CLIENT-003 (Barclays)</strong>
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className="btn btn-ghost btn-sm">← Prev</button>
          <button className="btn btn-ghost btn-sm">Next →</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setStatus('draft')}>Save Draft</button>
          <button className="btn btn-primary btn-sm" onClick={() => setStatus('submitted')}>Submit Timesheet</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div className={styles.tsGrid}>
          <div className={styles.tsHeader}>Project</div>
          {timesheetData.days.map(d => (
            <div key={d} className={styles.tsHeader}>{d.split(' ')[0]}<br /><span className={styles.tsDate}>{d.split(' ')[1]}</span></div>
          ))}

          {rows.map((row, ri) => (
            <div key={ri} className={styles.tsRowGroup}>
              <div className={styles.tsRowLabel}>{row.label}</div>
              {row.hours.map((h, di) => (
                <div key={di} className={styles.tsCell}>
                  <input
                    className={styles.tsInput}
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={h}
                    onChange={e => setHour(ri, di, e.target.value)}
                  />
                </div>
              ))}
            </div>
          ))}

          <div className={styles.tsTotalLabel}>Daily Total</div>
          {dailyTotals.map((t, i) => (
            <div key={i} className={styles.tsTotal}>{t}</div>
          ))}
        </div>
      </div>

      <div className={styles.summaryGrid}>
        <div className="card" style={{ padding: '16px 20px' }}>
          <div className="section-title">Weekly Total</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 32, fontWeight: 700, color: 'var(--lime)' }}>{weekTotal.toFixed(1)} <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>hrs</span></div>
        </div>
        <div className="card" style={{ padding: '16px 20px' }}>
          <div className="section-title">Status</div>
          <div style={{ marginTop: 8 }}>
            <span className={`badge badge-${status === 'submitted' ? 'approved' : 'pending'}`}>
              {status === 'submitted' ? 'SUBMITTED' : 'DRAFT'}
            </span>
          </div>
        </div>
        <div className="card" style={{ padding: '16px 20px' }}>
          <div className="section-title">Last Week</div>
          <div style={{ marginTop: 8 }}><span className="badge badge-approved">APPROVED</span></div>
        </div>
      </div>
    </div>
  );
}
