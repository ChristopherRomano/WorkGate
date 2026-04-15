import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEmployeeProfile, updateEmployeeProfile } from '../api/api';
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

function splitDisplayName(user) {
  const rawName = user?.name?.trim() ?? '';
  const firstName = user?.firstName?.trim() ?? rawName.split(' ')[0] ?? '';
  const surname = user?.surname?.trim() ?? rawName.split(' ').slice(1).join(' ');

  return {
    firstName,
    surname,
  };
}

function buildFormData(user) {
  const { firstName, surname } = splitDisplayName(user);
  return {
    firstName,
    surname,
    phoneNumber: user?.phone ?? '',
    address: user?.address ?? '',
    emergencyContactName: user?.emergencyContact ?? '',
    emergencyContactNumber: user?.emergencyPhone ?? '',
    profilePicture: user?.profilePicture ?? '',
  };
}

function deriveDisplayName(firstName, surname, fallback) {
  const fullName = [firstName, surname].filter(Boolean).join(' ').trim();
  return fullName || fallback || '';
}

function deriveInitials(firstName, surname, fallback) {
  const letters = [firstName, surname]
    .map((part) => part?.trim()?.[0] ?? '')
    .join('')
    .toUpperCase();

  return letters || fallback || 'WG';
}

function mapBackendProfileToUser(profile, currentUser) {
  const existingName = splitDisplayName(currentUser);
  const firstName = profile?.name ?? existingName.firstName;
  const surname = profile?.surname ?? existingName.surname;

  return {
    ...currentUser,
    firstName,
    surname,
    name: deriveDisplayName(firstName, surname, currentUser?.name),
    phone: profile?.phoneNumber ?? currentUser?.phone ?? '',
    address: profile?.address ?? currentUser?.address ?? '',
    emergencyContact: profile?.emergencyContact ?? currentUser?.emergencyContact ?? '',
    emergencyPhone: profile?.emergencyContactNumber ?? currentUser?.emergencyPhone ?? '',
    manager: profile?.managerEmail ?? currentUser?.manager ?? '',
    profilePicture: profile?.profilePicture ?? currentUser?.profilePicture ?? '',
    initials: deriveInitials(firstName, surname, currentUser?.initials),
    tag: profile?.tag ?? currentUser?.tag,
  };
}

export default function Profile() {
  const { currentUser, logout, updateCurrentUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [skills, setSkills] = useState(currentUser?.skills ?? []);
  const [showEdit, setShowEdit] = useState(false);
  const [showSkill, setShowSkill] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [customSkill, setCustomSkill] = useState('');
  const [formData, setFormData] = useState(() => buildFormData(currentUser));
  const [profileLoading, setProfileLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const isConsultant = currentUser?.role === 'consultant';

  useEffect(() => {
    setSkills(currentUser?.skills ?? []);
    setFormData(buildFormData(currentUser));
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser?.email) return;

    let cancelled = false;
    setProfileLoading(true);

    fetchEmployeeProfile(currentUser.email)
      .then((profile) => {
        if (cancelled || !profile) return;
        updateCurrentUser((previous) => mapBackendProfileToUser(profile, previous));
      })
      .catch(() => {
        // Keep mock user data when the profile has not been persisted yet.
      })
      .finally(() => {
        if (!cancelled) {
          setProfileLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser?.email]);

  const addSkill = () => {
    const skill = selectedSkill === 'Other' ? customSkill.trim() : selectedSkill;
    if (skill) {
      setSkills((existingSkills) => [...existingSkills, skill]);
      setSelectedSkill('');
      setCustomSkill('');
      setShowSkill(false);
    }
  };

  const onSubmit = async () => {
    if (!currentUser?.email) return;

    setSaving(true);
    setSaveError('');
    setStatusMessage('');

    try {
      const savedProfile = await updateEmployeeProfile({
        email: currentUser.email,
        role: currentUser.role,
        name: formData.firstName.trim(),
        surname: formData.surname.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        address: formData.address.trim(),
        emergencyContactName: formData.emergencyContactName.trim(),
        emergencyContactNumber: formData.emergencyContactNumber.trim(),
        profilePicture: formData.profilePicture.trim(),
      });

      updateCurrentUser((previous) => mapBackendProfileToUser(savedProfile, previous));
      setStatusMessage('Personal details saved to the database.');
      setShowEdit(false);
    } catch (error) {
      setSaveError(error.message || 'Could not save your profile details.');
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) return null;

  const detailRows = [
    ['EMAIL', currentUser.email],
    ['PHONE', currentUser.phone ?? '—'],
    ['ADDRESS', currentUser.address ?? '—'],
    ['MANAGER', currentUser.manager ?? '—'],
    ['EMERGENCY', currentUser.emergencyContact
      ? `${currentUser.emergencyContact} · ${currentUser.emergencyPhone ?? '—'}`
      : '—'],
    ...(isConsultant ? [
      ['CLIENT CODE', `${currentUser.clientCode ?? '—'} (${currentUser.clientName ?? '—'})`],
      ['PROJECT END', currentUser.projectEndDate ?? '—'],
    ] : []),
  ];

  const roleLabel = {
    employee: 'Employee',
    consultant: 'Consultant',
    manager: 'Manager',
    ittech: 'IT Technician',
    hr: 'HR Rep',
    admin: 'Administrator',
  }[currentUser.role] ?? currentUser.role;

  return (
    <div className="animate-fade">
      {statusMessage && (
        <div style={{
          marginBottom: 12,
          padding: '10px 14px',
          background: 'rgba(16,185,129,0.12)',
          border: '1px solid rgba(16,185,129,0.28)',
          borderRadius: 8,
          fontSize: 13,
          color: 'var(--text)',
        }}>
          {statusMessage}
        </div>
      )}

      {/* Header */}
      <div className={styles.profileHeader}>
        <div className={styles.bigAvatar}>{currentUser.initials}</div>
        <div className={styles.profileMeta}>
          <div className={styles.profileName}>{currentUser.name}</div>
          <div className={styles.profileRole}>
            {roleLabel} · FDM Group
            {isConsultant && ` · ${currentUser.clientCode ?? '—'} (${currentUser.clientName ?? '—'})`}
          </div>
          <div className={styles.profileTags}>
            <span className="badge badge-deployed">{currentUser.tag ?? 'EMPLOYEE'}</span>
            {profileLoading && <span className="pill pill-medium">Syncing profile…</span>}
            {isConsultant && (
              <span className="pill pill-medium">End Date: {currentUser.projectEndDate ?? '—'}</span>
            )}
          </div>
        </div>
        <div className={styles.profileActions}>
          {isConsultant && (
            <button className="btn btn-primary">↓ Download FDM Profile</button>
          )}
        </div>
      </div>

      <div className={isConsultant ? styles.twoCol : styles.fullWidth}>
        {/* Personal Details */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Personal Details</span>
            <button className="btn btn-ghost btn-sm" onClick={() => { setSaveError(''); setShowEdit(true); }}>Edit</button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table style={{ fontSize: 13 }}>
              <tbody>
                {detailRows.map(([label, value]) => (
                  <tr key={label}>
                    <td className={styles.detailLabel}>{label}</td>
                    <td className={styles.detailValue}>{value}</td>
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
                {skills.map((skill, index) => (
                  <div key={index} className={styles.skillTag}>
                    {skill}
                    <button onClick={() => setSkills((existingSkills) => existingSkills.filter((_, skillIndex) => skillIndex !== index))}>×</button>
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
            <div className="form-group">
              <label>First Name</label>
              <input
                className="field"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                className="field"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              className="field"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Home Address</label>
            <input
              className="field"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Emergency Contact Name</label>
            <input
              className="field"
              value={formData.emergencyContactName}
              onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Emergency Contact Phone</label>
            <input
              className="field"
              value={formData.emergencyContactNumber}
              onChange={(e) => setFormData({ ...formData, emergencyContactNumber: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Profile Photo URL</label>
            <input
              className="field"
              placeholder="Optional image URL"
              value={formData.profilePicture}
              onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
            />
          </div>
          {saveError && (
            <div style={{
              fontSize: 13,
              color: 'var(--danger)',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 8,
              padding: '10px 14px',
            }}>
              {saveError}
            </div>
          )}
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={onSubmit} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button className="btn btn-ghost" onClick={() => setShowEdit(false)}>Cancel</button>
          </div>
        </div>
      </Modal>

      {/* Add Skill Modal — consultant only */}
      <Modal isOpen={showSkill} onClose={() => { setShowSkill(false); setSelectedSkill(''); setCustomSkill(''); }} title="Add Key Skill">
        <div className="form-grid">
          <div className="form-group">
            <label>Skill</label>
            <select className="field" value={selectedSkill} onChange={(e) => { setSelectedSkill(e.target.value); setCustomSkill(''); }}>
              <option value="">Select a skill...</option>
              {SKILL_OPTIONS.map((skill) => <option key={skill} value={skill}>{skill}</option>)}
            </select>
          </div>
          {selectedSkill === 'Other' && (
            <div className="form-group">
              <label>Custom Skill</label>
              <input
                className="field"
                placeholder="Enter skill name..."
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                autoFocus
              />
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
