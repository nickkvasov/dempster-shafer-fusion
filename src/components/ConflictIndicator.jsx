import React from 'react';

function getConflictLevel(k) {
  if (k < 0.3) return { label: 'Low', color: '#22c55e' };
  if (k < 0.6) return { label: 'Moderate', color: '#eab308' };
  if (k < 0.8) return { label: 'High', color: '#f97316' };
  return { label: 'Very High', color: '#ef4444' };
}

export default function ConflictIndicator({ k, step }) {
  const { label, color } = getConflictLevel(k);

  return (
    <div style={{ margin: '8px 0' }}>
      <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 4 }}>
        Conflict{step != null ? ` (Step ${step})` : ''}: K = {k.toFixed(4)}
        <span style={{ marginLeft: 8, fontWeight: 600, color }}>{label}</span>
      </div>
      <div
        style={{
          height: 10,
          background: '#e2e8f0',
          borderRadius: 5,
          overflow: 'hidden',
          maxWidth: 300,
        }}
      >
        <div
          style={{
            width: `${Math.min(k * 100, 100)}%`,
            height: '100%',
            background: color,
            borderRadius: 5,
            transition: 'width 0.3s',
          }}
        />
      </div>
    </div>
  );
}
