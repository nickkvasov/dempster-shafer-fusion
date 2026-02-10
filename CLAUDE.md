# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server at http://localhost:5173
- `npm run build` — Production build to `dist/`
- `npm run preview` — Serve production build locally
- No test runner, linter, or CI is configured

## Architecture

This is a React 18 + Vite app that visualizes Dempster-Shafer theory evidence fusion. Pure JavaScript (no TypeScript). Inline styles throughout (no CSS framework or chart library).

### Data Flow

```
scenarios.js (static scenario definitions)
  → ScenarioPanel.jsx (holds reliability slider state)
    → discount() each source mass by its reliability
    → combineMultiple() discounted masses sequentially
    → render: MassTable (per source) + FusionResult (combined)
```

All computation is derived via `useMemo` keyed on `[scenario, reliabilities]`.

### DS Engine (`src/dempster.js`)

Pure, stateless functions — no React dependency, framework-agnostic:

- **Subset keys** are comma-sorted strings: `"A"`, `"A,B"`, `"A,B,C"`. The full frame key (e.g. `"A,B,C"`) represents total ignorance (Theta).
- `combine(m1, m2)` — Dempster's combination rule with conflict factor K
- `combineMultiple(masses)` — Sequential fusion, returns intermediates at each step
- `discount(mass, reliability, frame)` — Shafer's discounting: shifts mass toward Theta as reliability decreases
- `belief()` / `plausibility()` — Lower/upper probability bounds per hypothesis
- Invariant: combined masses always sum to 1.0; Bel(H) <= Pl(H) for all H

### Component Responsibilities

- **ScenarioPanel** — Only stateful component (reliability sliders). Orchestrates discounting + fusion, passes computed results down.
- **MassTable** — Renders focal elements table. Solid bars = singleton hypotheses, striped bars = compound sets (uncertainty). Shows specific vs uncertain summary.
- **BeliefPlausibilityChart** — Interval chart with 0-1 scale. Solid = belief (certain support), striped = uncertainty gap (Pl - Bel).
- **ConflictIndicator** — K factor bar, color-coded: green (<0.3) → yellow → orange → red (>0.8).
- **FusionResult** — Composes MassTable + BeliefPlausibilityChart + ConflictIndicator. Shows step-by-step intermediates for 3+ source scenarios.

### Hypothesis Colors

Consistent across all components: A = blue (#3b82f6), B = red (#ef4444), C = green (#22c55e), D = purple (#a855f7).

## Scenarios

Six predefined scenarios in `src/scenarios.js`, each with a frame of 2-4 classes and 2-5 sources with default reliability values. Scenarios cover: concordant evidence (Clear Winner), ambiguous evidence (Borderline), high ignorance (High Uncertainty), contradictory sources (High Conflict), progressive convergence (Convergent Multi-Source), and single-class detectors in binary classification (Focused Majority — 5 sources, each knowing only one class with its own confidence and reliability).
