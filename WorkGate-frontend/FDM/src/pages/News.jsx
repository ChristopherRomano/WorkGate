import { useState } from 'react';
import { newsPosts } from '../data/mockData';
import '../styles/components.css';
import styles from './News.module.css';

const CATEGORIES = ['All', 'Global', 'Regional', 'Social'];

export default function News() {
  const [cat, setCat] = useState('All');

  const filtered = cat === 'All'
    ? [...newsPosts].sort((a, b) => b.pinned - a.pinned)
    : newsPosts.filter(p => p.category === cat);

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {CATEGORIES.map(c => (
          <button key={c} className={`btn ${cat === c ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: '4px 20px' }}>
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-dim)', fontSize: 13 }}>No posts in this category.</div>
          )}
          {filtered.map(post => (
            <div key={post.id} className={styles.postItem}>
              {post.pinned && <div className={styles.pinBadge}>📌 Pinned</div>}
              <div className={styles.postTitle}>{post.title}</div>
              <div className={styles.postBody}>{post.excerpt}</div>
              <div className={styles.postFooter}>
                <span>{post.author} · {post.date}</span>
                <span className={styles.catTag}>{post.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
