import React from 'react';

const HYPOTHESIS_COLORS = {
  A: '#3b82f6',
  B: '#ef4444',
  C: '#22c55e',
  D: '#a855f7',
};

function stripedBackground(color) {
  return `repeating-linear-gradient(
    -45deg,
    ${color}44,
    ${color}44 3px,
    transparent 3px,
    transparent 6px
  )`;
}

const TICKS = [0, 0.25, 0.5, 0.75, 1.0];

export default function BeliefPlausibilityChart({ data }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: 16,
      }}
    >
      <h4 style={{ margin: '0 0 4px', fontSize: '0.9rem', color: '#334155' }}>
        Belief &amp; Plausibility Intervals
      </h4>
      <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: 16, lineHeight: 1.5 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginRight: 14 }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 2, background: '#3b82f6', opacity: 0.75 }} />
          Belief (certain support)
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 2, background: stripedBackground('#3b82f6'), border: '1px solid #3b82f644' }} />
          Uncertainty gap (Pl - Bel)
        </span>
      </div>

      {/* Scale axis */}
      <div style={{ marginLeft: 28, marginRight: 8, position: 'relative', height: 16, marginBottom: 2 }}>
        {TICKS.map((t) => (
          <div
            key={t}
            style={{
              position: 'absolute',
              left: `${t * 100}%`,
              transform: 'translateX(-50%)',
              fontSize: '0.7rem',
              color: '#94a3b8',
            }}
          >
            {t}
          </div>
        ))}
      </div>

      {data.map(({ hypothesis, bel, pl }) => {
        const color = HYPOTHESIS_COLORS[hypothesis] || '#64748b';
        const uncertaintyWidth = pl - bel;

        return (
          <div key={hypothesis} style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
            {/* Hypothesis label */}
            <span
              style={{
                fontWeight: 700,
                width: 20,
                fontSize: '0.9rem',
                color,
                textAlign: 'center',
                flexShrink: 0,
              }}
            >
              {hypothesis}
            </span>

            {/* Interval bar area */}
            <div style={{ flex: 1, marginLeft: 8, position: 'relative' }}>
              {/* Track with grid lines */}
              <div
                style={{
                  height: 28,
                  background: '#f8fafc',
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Vertical grid lines */}
                {TICKS.slice(1, -1).map((t) => (
                  <div
                    key={t}
                    style={{
                      position: 'absolute',
                      left: `${t * 100}%`,
                      top: 0,
                      width: 1,
                      height: '100%',
                      background: '#e2e8f0',
                    }}
                  />
                ))}

                {/* Belief portion (solid — certain support) */}
                {bel > 0.001 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 3,
                      width: `${bel * 100}%`,
                      height: 22,
                      background: color,
                      opacity: 0.75,
                      borderRadius: '3px 0 0 3px',
                    }}
                  />
                )}

                {/* Uncertainty gap (striped — between Bel and Pl) */}
                {uncertaintyWidth > 0.001 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${bel * 100}%`,
                      top: 3,
                      width: `${uncertaintyWidth * 100}%`,
                      height: 22,
                      background: stripedBackground(color),
                      border: `1px dashed ${color}66`,
                      borderLeft: bel > 0.001 ? 'none' : undefined,
                      borderRadius:
                        bel <= 0.001 ? '3px 0 0 3px' : '0',
                    }}
                  />
                )}

                {/* Bel marker */}
                {bel > 0.001 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${bel * 100}%`,
                      top: 1,
                      width: 2,
                      height: 26,
                      background: color,
                    }}
                  />
                )}

                {/* Pl marker */}
                {pl > 0.001 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${pl * 100}%`,
                      top: 1,
                      width: 2,
                      height: 26,
                      background: color,
                      transform: 'translateX(-2px)',
                    }}
                  />
                )}
              </div>

              {/* Values underneath */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 2,
                  fontSize: '0.72rem',
                  fontFamily: 'monospace',
                }}
              >
                <span style={{ color }}>
                  Bel={bel.toFixed(3)}
                </span>
                {uncertaintyWidth > 0.01 && (
                  <span style={{ color: '#94a3b8' }}>
                    gap={uncertaintyWidth.toFixed(3)}
                  </span>
                )}
                <span style={{ color }}>
                  Pl={pl.toFixed(3)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
