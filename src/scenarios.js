/**
 * Scenarios for Dempster-Shafer fusion demonstration.
 * Each scenario uses a frame of 3+ classes and defines 2-3 evidence sources.
 */

const scenarios = [
  {
    id: 'clear-winner',
    name: 'Clear Winner',
    description:
      'Both sources agree that hypothesis A is most likely. After fusion, mass concentrates strongly on A.',
    frame: ['A', 'B', 'C'],
    sources: [
      {
        name: 'Source 1 (Sensor)',
        mass: { A: 0.7, B: 0.1, C: 0.05, 'A,B,C': 0.15 },
        reliability: 0.9,
      },
      {
        name: 'Source 2 (Expert)',
        mass: { A: 0.6, B: 0.15, C: 0.1, 'A,B,C': 0.15 },
        reliability: 0.85,
      },
    ],
    explanation:
      'When two independent sources both point to the same hypothesis, Dempster\'s rule amplifies the agreement. The combined mass on A is much higher than either source alone, demonstrating the reinforcement effect of concordant evidence.',
  },
  {
    id: 'borderline',
    name: 'Borderline Decision',
    description:
      'Sources provide nearly equal evidence for A and B, making it hard to distinguish between them.',
    frame: ['A', 'B', 'C'],
    sources: [
      {
        name: 'Source 1 (Test α)',
        mass: { A: 0.35, B: 0.3, C: 0.05, 'A,B': 0.2, 'A,B,C': 0.1 },
        reliability: 0.95,
      },
      {
        name: 'Source 2 (Test β)',
        mass: { A: 0.3, B: 0.35, C: 0.05, 'A,B': 0.15, 'A,B,C': 0.15 },
        reliability: 0.9,
      },
    ],
    explanation:
      'Even after fusion, hypotheses A and B remain close in both belief and plausibility. The belief-plausibility intervals overlap significantly, indicating the evidence is insufficient to make a confident decision between them.',
  },
  {
    id: 'high-uncertainty',
    name: 'High Uncertainty',
    description:
      'Sources are vague — most mass is assigned to the full frame Θ, leaving the outcome inconclusive.',
    frame: ['A', 'B', 'C', 'D'],
    sources: [
      {
        name: 'Source 1 (Weak signal)',
        mass: { A: 0.1, B: 0.05, 'A,B,C,D': 0.85 },
        reliability: 0.6,
      },
      {
        name: 'Source 2 (Noisy channel)',
        mass: { C: 0.08, D: 0.07, 'A,B,C,D': 0.85 },
        reliability: 0.5,
      },
    ],
    explanation:
      'When sources assign most of their mass to the full frame (total ignorance), the combined result retains high uncertainty. The belief-plausibility intervals are wide for all hypotheses, reflecting genuine lack of knowledge.',
  },
  {
    id: 'high-conflict',
    name: 'High Conflict',
    description:
      'Sources strongly disagree — one points to A while the other points to B. The conflict factor K is high.',
    frame: ['A', 'B', 'C'],
    sources: [
      {
        name: 'Source 1 (Detector X)',
        mass: { A: 0.8, B: 0.05, C: 0.05, 'A,B,C': 0.1 },
        reliability: 0.95,
      },
      {
        name: 'Source 2 (Detector Y)',
        mass: { A: 0.05, B: 0.8, C: 0.05, 'A,B,C': 0.1 },
        reliability: 0.95,
      },
    ],
    explanation:
      'A high conflict factor K indicates the sources are largely incompatible. Dempster\'s rule normalizes away the conflict, which can produce counter-intuitive results. In practice, high K warns that the sources may not be reliable or that the frame of discernment may be incomplete.',
  },
  {
    id: 'convergent',
    name: 'Convergent Multi-Source',
    description:
      'Three sources with moderate evidence gradually narrow down the answer through step-by-step fusion.',
    frame: ['A', 'B', 'C'],
    sources: [
      {
        name: 'Source 1 (Initial reading)',
        mass: { A: 0.4, B: 0.25, C: 0.15, 'A,B,C': 0.2 },
        reliability: 0.8,
      },
      {
        name: 'Source 2 (Follow-up test)',
        mass: { A: 0.35, B: 0.2, C: 0.1, 'A,B': 0.15, 'A,B,C': 0.2 },
        reliability: 0.85,
      },
      {
        name: 'Source 3 (Confirmation)',
        mass: { A: 0.5, B: 0.1, C: 0.05, 'A,B,C': 0.35 },
        reliability: 0.9,
      },
    ],
    explanation:
      'This scenario shows how adding more concordant sources progressively increases confidence. After each fusion step, the belief in A grows while uncertainty (mass on the full frame) shrinks. The step-by-step view reveals the convergence process.',
  },
];

export default scenarios;
