# Dempster-Shafer Evidence Fusion Panel

Interactive visualization of [Dempster-Shafer theory](https://en.wikipedia.org/wiki/Dempster%E2%80%93Shafer_theory) evidence fusion across multiple scenarios. Built with React 18 and Vite.

![screenshot](https://github.com/user-attachments/assets/placeholder)

## Quickstart

```bash
git clone https://github.com/nickkvasov/dempster-shafer-fusion.git
cd dempster-shafer-fusion
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## What It Does

Dempster-Shafer theory generalizes Bayesian reasoning by assigning belief masses to *sets* of hypotheses rather than just singletons. This app lets you explore how evidence from multiple sources is combined using Dempster's rule of combination, and how source reliability affects the outcome.

### Features

- **6 built-in scenarios** demonstrating different fusion outcomes
- **Adjustable source reliability** via sliders (Shafer's discounting)
- **Mass function tables** with visual bars distinguishing specific evidence from uncertainty (striped)
- **Belief & Plausibility interval chart** showing certain support vs. uncertainty gap per hypothesis
- **Conflict indicator** (K factor) with color-coded severity
- **Step-by-step fusion** view for multi-source scenarios

### Scenarios

| Scenario | Frame | Sources | What It Shows |
|----------|-------|---------|---------------|
| **Clear Winner** | {A, B, C} | 2 | Concordant sources reinforce each other — A dominates after fusion |
| **Borderline Decision** | {A, B, C} | 2 | Nearly tied hypotheses with overlapping Bel/Pl intervals |
| **High Uncertainty** | {A, B, C, D} | 2 | Vague sources produce wide intervals and high residual ignorance |
| **High Conflict** | {A, B, C} | 2 | Contradictory sources yield high K, demonstrating normalization issues |
| **Convergent Multi-Source** | {A, B, C} | 3 | Progressive narrowing of uncertainty through sequential fusion |
| **Focused Majority** | {A, B} | 5 | Single-class detectors in a binary classification tug-of-war |

## How It Works

### Dempster's Combination Rule

Given two mass functions m1 and m2 over frame Theta:

```
m12(A) = (1 / (1 - K)) * sum{ m1(B) * m2(C) : B intersect C = A }
```

where **K** is the conflict factor:

```
K = sum{ m1(B) * m2(C) : B intersect C = empty }
```

### Source Reliability (Discounting)

Each source has a reliability parameter r in [0, 1]. The discounted mass function is:

```
m'(A) = r * m(A)          for A != Theta
m'(Theta) = 1 - r + r * m(Theta)
```

- r = 1: fully trusted (no change)
- r = 0: fully discounted (all mass goes to total ignorance)

### Belief and Plausibility

For each hypothesis H:

- **Belief** Bel(H) = sum of m(B) for all B that are subsets of H
- **Plausibility** Pl(H) = sum of m(B) for all B that intersect H

The interval [Bel(H), Pl(H)] bounds the true probability. A narrow gap means high certainty; a wide gap means the evidence is ambiguous.

## Project Structure

```
src/
  dempster.js              # DS theory engine (pure functions)
  scenarios.js             # 6 predefined scenarios
  App.jsx                  # Scenario tab selector + layout
  App.css                  # Global styles
  main.jsx                 # React entry point
  components/
    ScenarioPanel.jsx      # Full scenario view with reliability sliders
    MassTable.jsx          # Mass function table with visual bars
    FusionResult.jsx       # Combined result + Bel/Pl chart
    BeliefPlausibilityChart.jsx  # Interval chart per hypothesis
    ConflictIndicator.jsx  # K factor meter
```

## Tech Stack

- React 18
- Vite
- Pure CSS visualizations (no chart libraries)

## License

MIT
