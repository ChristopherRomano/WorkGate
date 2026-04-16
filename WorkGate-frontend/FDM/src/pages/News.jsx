import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { fetchPosts, deletePost } from '../api/api';
import { useAuth } from '../context/AuthContext';
import '../styles/components.css';
import styles from './News.module.css';

const CATEGORIES = ['All', 'Global', 'Regional', 'Social'];

function formatDate(epochMs) {
  if (!epochMs) return '—';
  return new Date(epochMs).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function mapVisibility(visibility) {
  if (!visibility) return 'Global';
  const v = String(visibility).toUpperCase();
  if (v === 'GLOBAL')   return 'Global';
  if (v === 'REGIONAL') return 'Regional';
  if (v === 'SOCIAL')   return 'Social';
  return 'Global';
}

export default function News() {
  const { currentUser } = useAuth();
  const canDelete = currentUser?.role === 'manager' || currentUser?.role === 'hr';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cat, setCat] = useState('All');
  const [confirmId, setConfirmId] = useState(null);
  const [exitingId, setExitingId] = useState(null);

  useEffect(() => {
    fetchPosts()
      .then((data) => setPosts(data ?? []))
      .catch(() => setError('Could not load news posts.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    const id = confirmId;
    setConfirmId(null);
    setExitingId(id);
    setTimeout(async () => {
      try {
        await deletePost(id);
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } catch {
        setError('Could not delete post.');
      } finally {
        setExitingId(null);
      }
    }, 350);
  };

  const filtered = posts
    .filter((p) => cat === 'All' || mapVisibility(p.visibility) === cat)
    .sort((a, b) => {
      if (b.pinned !== a.pinned) return b.pinned ? 1 : -1;
      return (b.timePosted ?? 0) - (a.timePosted ?? 0);
    });

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`btn ${cat === c ? 'btn-primary' : 'btn-ghost'} btn-sm`}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: '4px 20px' }}>
          {loading && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-dim)', fontSize: 13 }}>
              Loading posts…
            </div>
          )}
          {error && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--danger)', fontSize: 13 }}>
              {error}
            </div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-dim)', fontSize: 13 }}>
              No posts in this category.
            </div>
          )}
          {filtered.map((post) => (
            <div
              key={post.id}
              className={`${styles.postItem} ${exitingId === post.id ? styles.postExit : ''}`}
            >
              {post.pinned && <div className={styles.pinBadge}>📌 Pinned</div>}
              <div className={styles.postTitle}>{post.title}</div>
              <div className={styles.postBody}>{post.content}</div>
              <div className={styles.postFooter}>
                <span>{post.authorUsername ?? '—'} · {formatDate(post.timePosted)}</span>
                <span className={styles.catTag}>{mapVisibility(post.visibility)}</span>
                {canDelete && (
                  <button
                    className="pill pill-high"
                    style={{ marginLeft: 'auto', cursor: 'pointer' }}
                    onClick={() => setConfirmId(post.id)}
                  >
                    DELETE
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {confirmId !== null && createPortal(
        <div className="modal-overlay" onClick={() => setConfirmId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ width: 360 }}>
            <div className="modal-body" style={{ padding: '32px 28px 24px', textAlign: 'center' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', fontSize: 22,
              }}>
                🗑️
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 8 }}>
                Delete Post
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 24px', lineHeight: 1.6 }}>
                This post will be permanently removed and cannot be recovered.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="btn"
                  style={{ flex: 1, background: 'var(--danger)', color: '#fff', border: 'none' }}
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setConfirmId(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}