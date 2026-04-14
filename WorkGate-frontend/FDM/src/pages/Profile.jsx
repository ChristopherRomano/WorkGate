import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './Profile.module.css';

const SKILL_OPTIONS = [
  'Python', 'Java', 'JavaScript', 'TypeScript', 'C#', 'C++', 'R',
  'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL',
  'React', 'Angular', 'Vue.js', 'Node.js', 'Spring Boot', '.NET',
  'Azure', 'AWS', 'GCP', 'Docker', 'Kubernetes', 'CI/CD',
  'Machine Learning', 'Data Analysis', 'Power BI', 'Tableau', 'Excel',
  'Agile', 'Scrum', 'JIRA', 'Project Management',
  'Linux', 'Networking', 'Cybersecurity',
  'Other',
];

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [skills, setSkills] = useState(currentUser?.skills ?? []);
  const [showEdit, setShowEdit] = useState(false);
  const [showSkill, setShowSkill] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [customSkill, setCustomSkill] = useState('');
  const [formData, setFormData] = useState({
    name: currentUser.name,
    surname: currentUser.surname,
    phoneNumber: currentUser.phone,
    address: currentUser.address,
    emergencyContactName: currentUser.emergencyContact,
    emergencyContactNumber: currentUser.emergencyPhone,
    profilePicture: null
  });

  const isConsultant = currentUser?.role === 'consultant';

  const createRequest = async (address,phoneNumber,emergencyContactNumber,emergencyContactName,surname,name, profilePicture) => {
  
      const request = {
        employeeName: "john",
        address: address,
        phoneNumber: phoneNumber,
        emergencyContactNumber: emergencyContactNumber,
        emergencyContactName : emergencyContactName,
        profilePicture : profilePicture,
        surname: surname,
        name: name,
      };

      try {
        const response = await fetch("http://localhost:8080/api/employeeUpdate", {
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

  const onSubmit = (e) =>{
    setShowEdit(false)
    createRequest(
      formData.address,
      formData.phoneNumber,
      formData.emergencyContactNumber,
      formData.emergencyContactName,
      formData.surname,
      formData.name,
  );
  }

  const addSkill = () => {
    const skill = selectedSkill === 'Other' ? customSkill.trim() : selectedSkill;
    if (skill) {
      setSkills(s => [...s, skill]);
      setSelectedSkill('');
      setCustomSkill('');
      setShowSkill(false);
    }
  };

  if (!currentUser) return null;

  const detailRows = [
    ['EMAIL',     currentUser.email],
    ['PHONE',     currentUser.phone ?? '—'],
    ['ADDRESS',   currentUser.address ?? '—'],
    ['MANAGER',   currentUser.manager ?? '—'],
    ['EMERGENCY', currentUser.emergencyContact
      ? `${currentUser.emergencyContact} · ${currentUser.emergencyPhone}`
      : '—'],
    ...(isConsultant ? [
      ['CLIENT CODE', `${currentUser.clientCode} (${currentUser.clientName})`],
      ['PROJECT END',  currentUser.projectEndDate],
    ] : []),
  ];

  const roleLabel = {
    employee:   'Employee',
    consultant: 'Consultant',
    manager:    'Manager',
  }[currentUser.role] ?? currentUser.role;

  return (
    <div className="animate-fade">
      {/* Header */}
      <div className={styles.profileHeader}>
        <div className={styles.bigAvatar}>{currentUser.initials}</div>
        <div className={styles.profileMeta}>
          <div className={styles.profileName}>{currentUser.name}</div>
          <div className={styles.profileRole}>
            {roleLabel} · FDM Group
            {isConsultant && ` · ${currentUser.clientCode} (${currentUser.clientName})`}
          </div>
          <div className={styles.profileTags}>
            <span className="badge badge-deployed">{currentUser.tag}</span>
            {isConsultant && (
              <span className="pill pill-medium">End Date: {currentUser.projectEndDate}</span>
            )}
          </div>
        </div>
        <div className={styles.profileActions}>
          {isConsultant && (
            <button className="btn btn-primary">↓ Download FDM Profile</button>
          )}
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
                {detailRows.map(([label, value]) => (
                  <tr key={label}>
                    <td style={{ color: 'var(--text-dim)', fontSize: 10, fontFamily: 'var(--mono)', width: 130, paddingLeft: 20 }}>{label}</td>
                    <td style={{ paddingRight: 20 }}><strong>{value}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Skills — consultant only */}
        {isConsultant && (
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
                {skills.length === 0 && (
                  <div style={{ color: 'var(--text-dim)', fontSize: 13 }}>No skills added yet.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preferences — mobile only */}
      <div className={styles.mobileSignOut}>
        <div className={styles.prefCard}>
          <div className={styles.prefTitle}>Preferences</div>
          <div className={styles.prefRow}>
            <span className={styles.prefLabel}>Appearance</span>
            <div className={styles.themeButtons}>
              <button
                className={`${styles.themeBtn} ${theme === 'light' ? styles.themeBtnActive : ''}`}
                onClick={() => setTheme('light')}
              >
                ◑ Light
              </button>
              <button
                className={`${styles.themeBtn} ${theme === 'dark' ? styles.themeBtnActive : ''}`}
                onClick={() => setTheme('dark')}
              >
                ● Dark
              </button>
            </div>
          </div>
        </div>
        <button
          className="btn btn-danger"
          style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
          onClick={() => { logout(); navigate('/login'); }}
        >
          Sign Out
        </button>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Personal Details">
        <div className="form-grid">
          <div className="form-grid form-grid-2">
            <div className="form-group"><label>First Name</label><input className="field" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}/></div>
            <div className="form-group"><label>Last Name</label><input className="field" value={formData.surname} onChange={(e) => setFormData({ ...formData, name: e.target.value })}/></div>
          </div>
          <div className="form-group"><label>Phone Number</label><input className="field" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, name: e.target.value })}/></div>
          <div className="form-group"><label>Home Address</label><input className="field" value={formData.address} onChange={(e) => setFormData({ ...formData, name: e.target.value })}/></div>
          <div className="form-group"><label>Emergency Contact Name</label><input className="field" value={formData.emergencyContactName} onChange={(e) => setFormData({ ...formData, name: e.target.value })}/></div>
          <div className="form-group"><label>Emergency Contact Phone</label><input className="field" value={formData.emergencyContactNumber} onChange={(e) => setFormData({ ...formData, name: e.target.value })}/></div>
          <div className="form-group">
            <label>Profile Photo</label>
            <div className="upload-zone">
              <div className="upload-zone-icon">📷</div>
              <div className="upload-zone-label">Click to upload photo</div>
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={onSubmit}>Save Changes</button>
            <button className="btn btn-ghost" onClick={() => setShowEdit(false)}>Cancel</button>
          </div>
        </div>
      </Modal>

      {/* Add Skill Modal — consultant only */}
      <Modal isOpen={showSkill} onClose={() => { setShowSkill(false); setSelectedSkill(''); setCustomSkill(''); }} title="Add Key Skill">
        <div className="form-grid">
          <div className="form-group">
            <label>Skill</label>
            <select className="field" value={selectedSkill} onChange={e => { setSelectedSkill(e.target.value); setCustomSkill(''); }}>
              <option value="">Select a skill...</option>
              {SKILL_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {selectedSkill === 'Other' && (
            <div className="form-group">
              <label>Custom Skill</label>
              <input className="field" placeholder="Enter skill name..." value={customSkill} onChange={e => setCustomSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} autoFocus />
            </div>
          )}
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={addSkill} disabled={!selectedSkill || (selectedSkill === 'Other' && !customSkill.trim())}>Add Skill</button>
            <button className="btn btn-ghost" onClick={() => { setShowSkill(false); setSelectedSkill(''); setCustomSkill(''); }}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
