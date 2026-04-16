import { useState } from 'react';
import { createPost } from '../api/api';
import { useAuth } from '../context/AuthContext';
import '../styles/components.css';

const EMPTY = {
  title: '',
  content: '',
  pinned: false,
  visibility: 'GLOBAL',
};

export default function Posting() {
  const { currentUser } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm((prev) => ({ ...prev, [key]: e.target.value })),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      await createPost({
        title: form.title.trim(),
        content: form.content.trim(),
        pinned: form.pinned,
        visibility: form.visibility,
        authorUsername: currentUser?.name ?? currentUser?.email ?? 'Unknown',
      });
      setSuccessMessage('Post published successfully.');
      setForm(EMPTY);
    } catch (err) {
      setError(err.message || 'Could not publish the post.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade">
      <div className="card" style={{ maxWidth: 680 }}>
        <div className="card-header">
          <span className="card-title">New Post</span>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">

              <div className="form-group">
                <label>Title</label>
                <input className="field" placeholder="Post title…" {...field('title')} />
              </div>

              <div className="form-group">
                <label>Content</label>
                <textarea
                  className="field"
                  placeholder="Write your announcement or update…"
                  rows={6}
                  value={form.content}
                  onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="form-group">
                <label>Visibility</label>
                <select className="field" value={form.visibility} onChange={(e) => setForm((prev) => ({ ...prev, visibility: e.target.value }))}>
                  <option value="GLOBAL">Global — visible to everyone</option>
                  <option value="REGIONAL">Regional</option>
                  <option value="SOCIAL">Social</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.pinned}
                    onChange={(e) => setForm((prev) => ({ ...prev, pinned: e.target.checked }))}
                  />
                  Pin this post to the top of the news feed
                </label>
              </div>

              {successMessage && (
                <div style={{ fontSize: 13, color: 'var(--text)', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.28)', borderRadius: 8, padding: '10px 14px' }}>
                  {successMessage}
                </div>
              )}

              {error && (
                <div style={{ fontSize: 13, color: 'var(--danger)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px' }}>
                  {error}
                </div>
              )}

              <div className="modal-actions">
                <button className="btn btn-primary" type="submit" disabled={submitting}>
                  {submitting ? 'Publishing…' : 'Publish Post'}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}