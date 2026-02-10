import React, { useState, useMemo } from 'react';
import MassTable from './MassTable';
import FusionResult from './FusionResult';
import { combineMultiple, discount } from '../dempster';

function reliabilityColor(r) {
  if (r >= 0.8) return '#22c55e';
  if (r >= 0.5) return '#eab308';
  if (r >= 0.3) return '#f97316';
  return '#ef4444';
}

export default function ScenarioPanel({ scenario }) {
  const defaults = scenario.sources.map((s) => s.reliability ?? 1);
  const [reliabilities, setReliabilities] = useState(defaults);

  // Reset when scenario changes
  const scenarioId = scenario.id;
  const [prevId, setPrevId] = useState(scenarioId);
  if (scenarioId !== prevId) {
    setPrevId(scenarioId);
    setReliabilities(scenario.sources.map((s) => s.reliability ?? 1));
  }

  const setReliability = (index, value) => {
    setReliabilities((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const { discountedMasses, combined, conflicts, intermediates } = useMemo(() => {
    const discounted = scenario.sources.map((s, i) =>
      discount(s.mass, reliabilities[i], scenario.frame)
    );
    const result = combineMultiple(discounted);
    return { discountedMasses: discounted, ...result };
  }, [scenario, reliabilities]);

  return (
    <div style={{ padding: '0 0 24px' }}>
      <p style={{ color: '#475569', margin: '0 0 16px', lineHeight: 1.5 }}>
        {scenario.description}
      </p>

      <h3 style={{ fontSize: '1rem', color: '#1e293b', margin: '0 0 12px' }}>
        Evidence Sources
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {scenario.sources.map((source, i) => {
          const r = reliabilities[i];
          const isDiscounted = r < 0.999;
          return (
            <div
              key={i}
              style={{
                flex: '1 1 220px',
                minWidth: 220,
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}
            >
              {/* Reliability slider */}
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderBottom: 'none',
                  borderRadius: '8px 8px 0 0',
                  padding: '10px 16px 8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Reliability</span>
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      fontFamily: 'monospace',
                      color: reliabilityColor(r),
                    }}
                  >
                    {(r * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round(r * 100)}
                  onChange={(e) => setReliability(i, Number(e.target.value) / 100)}
                  style={{
                    width: '100%',
                    height: 6,
                    cursor: 'pointer',
                    accentColor: reliabilityColor(r),
                  }}
                />
              </div>

              {/* Mass table — show discounted if reliability < 1 */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <MassTable
                  name={source.name}
                  mass={isDiscounted ? discountedMasses[i] : source.mass}
                  roundedTop={false}
                  badge={isDiscounted ? 'discounted' : undefined}
                />
              </div>
            </div>
          );
        })}
      </div>

      <FusionResult
        combined={combined}
        conflicts={conflicts}
        intermediates={intermediates}
        frame={scenario.frame}
      />

      <div
        style={{
          marginTop: 20,
          padding: 16,
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: 8,
          fontSize: '0.85rem',
          color: '#0c4a6e',
          lineHeight: 1.6,
        }}
      >
        <strong>Interpretation:</strong> {scenario.explanation}
      </div>
    </div>
  );
}
