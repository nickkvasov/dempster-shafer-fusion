import React from 'react';
import MassTable from './MassTable';
import ConflictIndicator from './ConflictIndicator';
import BeliefPlausibilityChart from './BeliefPlausibilityChart';
import { beliefPlausibility } from '../dempster';

export default function FusionResult({ combined, conflicts, intermediates, frame }) {
  const bpData = beliefPlausibility(combined, frame);
  const showSteps = intermediates && intermediates.length > 2;

  return (
    <div>
      <h3 style={{ fontSize: '1rem', color: '#1e293b', margin: '20px 0 12px' }}>
        Fusion Result
      </h3>

      {conflicts.map((k, i) => (
        <ConflictIndicator key={i} k={k} step={conflicts.length > 1 ? i + 1 : undefined} />
      ))}

      {showSteps && (
        <div style={{ marginTop: 16 }}>
          <h4 style={{ fontSize: '0.9rem', color: '#475569', margin: '0 0 8px' }}>
            Step-by-Step Fusion
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {intermediates.map((mass, i) => (
              <MassTable
                key={i}
                name={i === 0 ? 'Source 1' : `After fusing ${i + 1} sources`}
                mass={mass}
              />
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ flex: '1 1 280px' }}>
          <MassTable name="Combined Mass Function" mass={combined} />
        </div>
        <div style={{ flex: '1 1 320px' }}>
          <BeliefPlausibilityChart data={bpData} />
        </div>
      </div>
    </div>
  );
}
