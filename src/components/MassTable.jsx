import React from 'react';
import { formatSubset } from '../dempster';

const HYPOTHESIS_COLORS = {
  A: '#3b82f6',
  B: '#ef4444',
  C: '#22c55e',
  D: '#a855f7',
};

function isSingleton(key) {
  return !key.includes(',');
}

function getBarColor(key) {
  if (isSingleton(key)) return HYPOTHESIS_COLORS[key] || '#64748b';
  return '#94a3b8';
}

/** CSS repeating-linear-gradient for diagonal stripes (uncertainty). */
function stripedBackground(color) {
  return `repeating-linear-gradient(
    -45deg,
    ${color},
    ${color} 3px,
    transparent 3px,
    transparent 6px
  )`;
}

export default function MassTable({ name, mass, roundedTop = true, badge }) {
  const entries = Object.entries(mass).sort((a, b) => {
    const aLen = a[0].split(',').length;
    const bLen = b[0].split(',').length;
    if (aLen !== bLen) return aLen - bLen;
    return a[0].localeCompare(b[0]);
  });

  // Compute committed (singleton) vs uncertain (compound) totals
  let committed = 0;
  let uncertain = 0;
  for (const [key, val] of entries) {
    if (isSingleton(key)) committed += val;
    else uncertain += val;
  }

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: roundedTop ? 8 : '0 0 8px 8px',
        padding: 16,
        flex: '1 1 220px',
        minWidth: 220,
      }}
    >
      <h4 style={{ margin: '0 0 12px', fontSize: '0.9rem', color: '#334155', display: 'flex', alignItems: 'center', gap: 8 }}>
        {name}
        {badge && (
          <span
            style={{
              fontSize: '0.65rem',
              background: '#fef3c7',
              color: '#92400e',
              padding: '1px 6px',
              borderRadius: 4,
              fontWeight: 500,
            }}
          >
            {badge}
          </span>
        )}
      </h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
            <th style={{ textAlign: 'left', padding: '4px 8px', color: '#64748b' }}>Focal Element</th>
            <th style={{ textAlign: 'right', padding: '4px 8px', color: '#64748b', width: 60 }}>Mass</th>
            <th style={{ padding: '4px 8px', width: 120 }} />
          </tr>
        </thead>
        <tbody>
          {entries.map(([key, val]) => {
            const singleton = isSingleton(key);
            const color = getBarColor(key);
            return (
              <tr key={key} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '4px 8px', fontFamily: 'monospace' }}>
                  {formatSubset(key)}
                  {!singleton && (
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginLeft: 4 }}>
                      ?
                    </span>
                  )}
                </td>
                <td style={{ textAlign: 'right', padding: '4px 8px', fontFamily: 'monospace' }}>
                  {val.toFixed(4)}
                </td>
                <td style={{ padding: '4px 8px' }}>
                  <div
                    style={{
                      height: 14,
                      background: '#f1f5f9',
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${val * 100}%`,
                        height: '100%',
                        borderRadius: 3,
                        ...(singleton
                          ? { background: color, opacity: 0.75 }
                          : { background: stripedBackground(color), opacity: 0.6 }),
                      }}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Summary bar: committed evidence vs uncertainty */}
      <div style={{ marginTop: 12 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: '#64748b',
            marginBottom: 3,
          }}
        >
          <span>Specific: {(committed * 100).toFixed(1)}%</span>
          <span>Uncertain: {(uncertain * 100).toFixed(1)}%</span>
        </div>
        <div
          style={{
            height: 8,
            display: 'flex',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${committed * 100}%`,
              background: '#3b82f6',
              opacity: 0.7,
            }}
          />
          <div
            style={{
              width: `${uncertain * 100}%`,
              background: stripedBackground('#94a3b8'),
              opacity: 0.5,
            }}
          />
        </div>
      </div>
    </div>
  );
}
