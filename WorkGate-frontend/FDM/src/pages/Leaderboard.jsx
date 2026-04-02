import { useState } from 'react';
import { leaderboard, tasks } from '../data/mockData';
import '../styles/components.css';
import styles from './Leaderboard.module.css';

const RANK_COLORS = { 1: '#ffd700', 2: '#c0c0c0', 3: '#cd7f32' };

export default function Leaderboard() {
  const [optOut, setOptOut] = useState(false);

  const upskilling = tasks.filter(t => t.type === 'Upskilling');

  return (
    <div className="animate-fade">
      <div className={styles.twoCol}>
        {/* Rankings */}
        <div className="card">
          <div className="card-header"><span className="card-title">Top Consultants — April 2026</span></div>
          <div className="card-body" style={{ padding: '8px 20px' }}>
            {leaderboard.map(entry => (
              <div key={entry.rank} className={`${styles.lbRow} ${entry.isMe ? styles.lbMe : ''}`}>
                <div className={styles.rank} style={{ color: RANK_COLORS[entry.rank] || 'var(--text-dim)' }}>
                  {entry.rank}
                </div>
                <div className={styles.lbAvatar} style={entry.isMe ? { background: 'var(--lime)', color: 'var(--black)' } : {}}>
                  {entry.initials}
                </div>
                <div className={styles.lbName}>{entry.name}</div>
                <div className={styles.lbBarTrack}>
                  <div className={styles.lbBarFill} style={{ width: `${entry.pct}%` }} />
                </div>
                <div className={styles.lbScore}>{entry.score} pts</div>
              </div>
            ))}
          </div>
        </div>

        {/* My progress */}
        <div className="card">
          <div className="card-header"><span className="card-title">Your Upskilling Progress</span></div>
          <div className="card-body" style={{ padding: '8px 20px' }}>
            {upskilling.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{
                  width: 17, height: 17, borderRadius: 4, flexShrink: 0, marginTop: 2,
                  background: t.done ? 'var(--lime)' : 'transparent',
                  border: t.done ? 'none' : '2px solid var(--border-bright)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {t.done && <span style={{ color: 'var(--black)', fontSize: 10, fontWeight: 700 }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: t.done ? 'var(--text-dim)' : 'var(--text)', textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2, fontFamily: 'var(--mono)' }}>+3 pts on completion</div>
                </div>
              </div>
            ))}

            <div className="divider" />
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textTransform: 'none', letterSpacing: 0, fontSize: 13, color: 'var(--text-muted)' }}>
              <input type="checkbox" checked={optOut} onChange={() => setOptOut(o => !o)} style={{ width: 'auto', accentColor: 'var(--lime)' }} />
              Opt out of public leaderboard
            </label>
            {optOut && (
              <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-dim)', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
                Your profile will be hidden from the leaderboard. Your score is still tracked internally.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
