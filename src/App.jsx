import React, { useState } from 'react';
import './App.css';
import scenarios from './scenarios';
import ScenarioPanel from './components/ScenarioPanel';

export default function App() {
  const [activeId, setActiveId] = useState(scenarios[0].id);
  const active = scenarios.find((s) => s.id === activeId);

  return (
    <div className="app">
      <h1 className="app-title">Dempster-Shafer Evidence Fusion</h1>
      <p className="app-subtitle">
        Interactive visualization of belief function fusion across multiple scenarios
      </p>

      <div className="tabs">
        {scenarios.map((s) => (
          <button
            key={s.id}
            className={`tab ${s.id === activeId ? 'active' : ''}`}
            onClick={() => setActiveId(s.id)}
          >
            {s.name}
          </button>
        ))}
      </div>

      <h2 className="scenario-title">{active.name}</h2>
      <ScenarioPanel scenario={active} />
    </div>
  );
}
