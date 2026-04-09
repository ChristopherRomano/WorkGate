import { useState } from 'react';
import { currentUser } from '../data/mockData';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './Profile.module.css';

export default function Profile() {
  const [skills, setSkills] = useState(currentUser.skills);
  const [showEdit, setShowEdit] = useState(false);
  const [showSkill, setShowSkill] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim()) { setSkills(s => [...s, newSkill.trim()]); setNewSkill(''); setShowSkill(false); }
  };

  return (
    <div className="animate-fade">
      {/* Header */}
      <div className={styles.profileHeader}>
        <div className={styles.bigAvatar}>{currentUser.initials}</div>
        <div className={styles.profileMeta}>
          <div className={styles.profileName}>{currentUser.name}</div>
          <div className={styles.profileRole}>Consultant · FDM Group · {currentUser.clientCode} ({currentUser.clientName})</div>
          <div className={styles.profileTags}>
            <span className="badge badge-deployed">Deployed</span>
            <span className="pill pill-medium">End Date: {currentUser.projectEndDate}</span>
          </div>
        </div>
        <div className={styles.profileActions}>
          <button className="btn btn-primary">↓ Download FDM Profile</button>
        </div>
      </div>

      <div className={styles.twoCol}>
        {/* Personal Details */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Personal Details</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowEdit(true)}>Edit</button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table style={{ fontSize: 13 }}>
              <tbody>
                {[
                  ['EMAIL', currentUser.email],
                  ['PHONE', currentUser.phone],
                  ['ADDRESS', currentUser.address],
                  ['MANAGER', currentUser.manager],
                  ['EMERGENCY', `${currentUser.emergencyContact} · ${currentUser.emergencyPhone}`],
                  ['CLIENT CODE', `${currentUser.clientCode} (${currentUser.clientName})`],
                  ['PROJECT END', currentUser.projectEndDate],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <td style={{ color: 'var(--text-dim)', fontSize: 10, fontFamily: 'var(--mono)', width: 130, paddingLeft: 20 }}>{label}</td>
                    <td style={{ paddingRight: 20 }}><strong>{value}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Skills */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Key Skills</span>
            <button className="btn btn-primary btn-sm" onClick={() => setShowSkill(true)}>+ Add Skill</button>
          </div>
          <div className="card-body">
            <div className={styles.skillsGrid}>
              {skills.map((s, i) => (
                <div key={i} className={styles.skillTag}>
                  {s}
                  <button onClick={() => setSkills(sk => sk.filter((_, j) => j !== i))}>×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Personal Details">
        <div className="form-grid">
          <div className="form-grid form-grid-2">
            <div className="form-group"><label>First Name</label><input className="field" defaultValue="Jamie" /></div>
            <div className="form-group"><label>Last Name</label><input className="field" defaultValue="Chen" /></div>
          </div>
          <div className="form-group"><label>Phone Number</label><input className="field" defaultValue={currentUser.phone} /></div>
          <div className="form-group"><label>Home Address</label><input className="field" defaultValue={currentUser.address} /></div>
          <div className="form-group"><label>Emergency Contact Name</label><input className="field" defaultValue={currentUser.emergencyContact} /></div>
          <div className="form-group"><label>Emergency Contact Phone</label><input className="field" defaultValue={currentUser.emergencyPhone} /></div>
          <div className="form-group">
            <label>Profile Photo</label>
            <div className="upload-zone">
              <div className="upload-zone-icon">📷</div>
              <div className="upload-zone-label">Click to upload photo</div>
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={() => setShowEdit(false)}>Save Changes</button>
            <button className="btn btn-ghost" onClick={() => setShowEdit(false)}>Cancel</button>
          </div>
        </div>
      </Modal>

      {/* Add Skill Modal */}
      <Modal isOpen={showSkill} onClose={() => setShowSkill(false)} title="Add Key Skill">
        <div className="form-grid">
          <div className="form-group">
            <label>Skill Name</label>
            <input className="field" placeholder="e.g. Python, Azure, Tableau..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} />
          </div>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={addSkill}>Add Skill</button>
            <button className="btn btn-ghost" onClick={() => setShowSkill(false)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
