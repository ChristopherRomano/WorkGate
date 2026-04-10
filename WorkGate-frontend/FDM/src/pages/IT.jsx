import { useState } from 'react';
import { itTickets as initial } from '../data/mockData';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './IT.module.css';

const KB = [
  {
    q: 'How do I reset my password?',
    tag: 'Access', time: '2 min read',
    a: 'To reset your password, go to the WorkGate login page and click "Forgot password?". Enter your company email address and you will receive a reset link within 5 minutes. If you do not receive it, check your spam folder or contact IT support. Passwords must be at least 12 characters and include uppercase, lowercase, a number, and a special character.',
  },
  {
    q: 'VPN setup guide for remote working',
    tag: 'Network', time: '5 min read',
    a: 'Download the approved VPN client (GlobalProtect) from the FDM software portal. Install and launch the application, then enter the server address: vpn.fdmgroup.com. Sign in with your company credentials and complete the MFA prompt. Once connected, you will have full access to internal systems. If you experience connection issues, ensure your internet connection is stable and that your firewall is not blocking the VPN.',
  },
  {
    q: 'How to install required software on your laptop',
    tag: 'Software', time: '3 min read',
    a: 'All approved software is available through the FDM Software Centre on your laptop. Open the Software Centre from your taskbar, browse or search for the application you need, and click Install. Installation typically takes 5–15 minutes. If the software you need is not listed, raise an IT ticket and the team will review your request. Do not install unapproved software from the internet.',
  },
  {
    q: 'Setting up multi-factor authentication (MFA)',
    tag: 'Access', time: '4 min read',
    a: 'MFA is mandatory for all FDM accounts. To set it up, download the Microsoft Authenticator app on your mobile device. Go to aka.ms/mfasetup and sign in with your company account. Follow the on-screen instructions to scan the QR code with the Authenticator app. Once registered, you will be prompted for MFA approval each time you sign in from a new device or location.',
  },
  {
    q: 'Requesting a new hardware device',
    tag: 'Hardware', time: '2 min read',
    a: 'Hardware requests must be approved by your line manager before being submitted to IT. Raise an IT ticket with the category set to "Hardware", include the device type you need and the business justification. Standard lead time for hardware delivery is 5–7 working days. Urgent requests can be escalated through your manager to the IT team directly.',
  },
];

export default function IT() {
  const [tickets, setTickets] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [faqItem, setFaqItem] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title: '', category: 'Software', priority: 'Medium', desc: '' });


  const createRequest = async (enteredTitle,info,category,evidence) => {

    const request = {
      username: "john",
      creationTime: (new Date()).getTime(),
      title : enteredTitle,
      description: info,
      category: category,
      evidence: ["Image","Image"],
    };

    try {
      const response = await fetch("http://localhost:8080/api/createItTicket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
      });
      if (!response.ok) {
        throw new Error("Failed to create ticket");
      }
    } 
    catch (error) {
        console.error(error);
    }
  };

  const submit = () => {
    if (!form.title) return;
    setTickets(prev => [
      { id: `IT-${String(Math.floor(Math.random() * 900) + 100)}`, title: form.title, desc: form.desc, category: form.category, date: 'Today', status: 'open' },
      ...prev,
    ]);
    setShowModal(false);
    createRequest(form.title,form.desc,form.category)
    setForm({ title: '', category: 'Software', priority: 'Medium', desc: '' });
  };

  const filteredKB = KB.filter(k => k.q.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade">
      {/* My Tickets */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-header">
          <span className="card-title">My Tickets</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Raise Ticket</button>
        </div>
        <div style={{ padding: '10px 20px' }}>
          {tickets.map(t => (
            <div key={t.id} className={styles.ticketCard}>
              <div className={styles.ticketId}>{t.id}</div>
              <div style={{ flex: 1 }}>
                <div className={styles.ticketTitle}>{t.title}</div>
                <div className={styles.ticketDesc}>{t.desc}</div>
                <div className={styles.ticketFooter}>
                  <span>{t.category} · {t.date}</span>
                  <span className={`badge badge-${t.status}`}>{t.status.replace('progress', 'IN PROGRESS').toUpperCase()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Knowledge Base */}
      <div className="card">
        <div className="card-header"><span className="card-title">Knowledge Base</span></div>
        <div className="card-body">
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-dim)' }}>🔍</span>
            <input className="field" style={{ paddingLeft: 38 }} placeholder="Search common solutions..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {filteredKB.map((item, i) => (
            <div key={i} onClick={() => setFaqItem(item)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
              <span style={{ color: 'var(--lime)', fontSize: 16, flexShrink: 0 }}>?</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{item.q}</div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2, fontFamily: 'var(--mono)' }}>{item.tag} · {item.time}</div>
              </div>
              <span style={{ color: 'var(--text-dim)', fontSize: 18 }}>›</span>
            </div>
          ))}
          {filteredKB.length === 0 && (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-dim)', fontSize: 13 }}>No results found. Try raising a ticket instead.</div>
          )}
        </div>
      </div>

      <Modal isOpen={!!faqItem} onClose={() => setFaqItem(null)} title={faqItem?.q ?? ''}>
        <div style={{ padding: '4px 0 8px' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--lime)', background: 'var(--lime-dim)', border: '1px solid var(--lime-border)', padding: '2px 8px', borderRadius: 4 }}>{faqItem?.tag}</span>
            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text-dim)' }}>{faqItem?.time}</span>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>{faqItem?.a}</p>
          <div className="modal-actions" style={{ marginTop: 20 }}>
            <button className="btn btn-ghost" onClick={() => setFaqItem(null)}>Close</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Raise IT Ticket">
        <div className="form-grid">
          <div className="form-group">
            <label>Title</label>
            <input className="field" placeholder="Brief description of the issue" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label>Category</label>
              <select className="field" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option>Software</option><option>Hardware</option><option>Access</option><option>Network</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select className="field" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="field" style={{ minHeight: 100 }} placeholder="Describe the issue in detail..." value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Screenshot (optional)</label>
            <div className="upload-zone">
              <div className="upload-zone-icon">🖼</div>
              <div className="upload-zone-label">Attach screenshot</div>
              <div className="upload-zone-sub">PNG, JPG — max 5MB</div>
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={submit}>Submit Ticket</button>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
