/**
 * Dempster-Shafer Theory Engine
 *
 * Subset keys are sorted comma-joined strings of hypothesis names.
 * E.g. for frame {A, B, C}: "A", "B", "C", "A,B", "A,C", "B,C", "A,B,C"
 * The empty set is represented by "" but should never carry mass.
 */

/** Generate the power set of a frame (excluding the empty set). */
export function powerSet(frame) {
  const result = [];
  const n = frame.length;
  for (let mask = 1; mask < (1 << n); mask++) {
    const subset = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) subset.push(frame[i]);
    }
    result.push(subset.sort().join(','));
  }
  return result;
}

/** Intersect two subset keys. Returns "" for empty intersection. */
export function intersect(a, b) {
  const setA = new Set(a.split(','));
  const result = b.split(',').filter((x) => setA.has(x));
  return result.sort().join(',');
}

/**
 * Combine two mass functions using Dempster's rule.
 * Each mass function is an object: { subsetKey: massValue, ... }
 * Returns { combined: massFunction, conflict: K }
 */
export function combine(m1, m2) {
  let K = 0;
  const unnormalized = {};

  for (const [a, ma] of Object.entries(m1)) {
    for (const [b, mb] of Object.entries(m2)) {
      const cap = intersect(a, b);
      const product = ma * mb;
      if (cap === '') {
        K += product;
      } else {
        unnormalized[cap] = (unnormalized[cap] || 0) + product;
      }
    }
  }

  const norm = 1 - K;
  const combined = {};
  for (const [key, val] of Object.entries(unnormalized)) {
    combined[key] = val / norm;
  }

  return { combined, conflict: K };
}

/**
 * Combine an array of mass functions sequentially.
 * Returns { combined, conflicts } where conflicts[i] is the K from step i.
 * Also returns intermediates: the combined mass after each step.
 */
export function combineMultiple(massFunctions) {
  if (massFunctions.length === 0) return { combined: {}, conflicts: [], intermediates: [] };
  if (massFunctions.length === 1)
    return { combined: massFunctions[0], conflicts: [], intermediates: [massFunctions[0]] };

  let current = massFunctions[0];
  const conflicts = [];
  const intermediates = [current];

  for (let i = 1; i < massFunctions.length; i++) {
    const { combined, conflict } = combine(current, massFunctions[i]);
    current = combined;
    conflicts.push(conflict);
    intermediates.push(current);
  }

  return { combined: current, conflicts, intermediates };
}

/**
 * Compute Belief for a target subset (given as a key string).
 * Bel(A) = sum of m(B) for all B ⊆ A.
 */
export function belief(mass, targetKey) {
  const targetSet = new Set(targetKey.split(','));
  let bel = 0;
  for (const [key, val] of Object.entries(mass)) {
    const elements = key.split(',');
    if (elements.every((e) => targetSet.has(e))) {
      bel += val;
    }
  }
  return bel;
}

/**
 * Compute Plausibility for a target subset (given as a key string).
 * Pl(A) = sum of m(B) for all B such that B ∩ A ≠ ∅.
 */
export function plausibility(mass, targetKey) {
  const targetSet = new Set(targetKey.split(','));
  let pl = 0;
  for (const [key, val] of Object.entries(mass)) {
    const elements = key.split(',');
    if (elements.some((e) => targetSet.has(e))) {
      pl += val;
    }
  }
  return pl;
}

/**
 * Compute Bel and Pl for each singleton hypothesis in the frame.
 * Returns an array of { hypothesis, bel, pl }.
 */
export function beliefPlausibility(mass, frame) {
  return frame.map((h) => ({
    hypothesis: h,
    bel: belief(mass, h),
    pl: plausibility(mass, h),
  }));
}

/**
 * Discount a mass function by source reliability r ∈ [0, 1].
 * m'(A) = r · m(A) for A ≠ Θ
 * m'(Θ) = 1 − r + r · m(Θ)
 * When r = 1 the source is fully trusted (no change).
 * When r = 0 the source is fully discounted (all mass goes to Θ).
 */
export function discount(mass, reliability, frame) {
  const thetaKey = [...frame].sort().join(',');
  const r = Math.max(0, Math.min(1, reliability));
  const result = {};

  let thetaMass = 0;
  for (const [key, val] of Object.entries(mass)) {
    if (key === thetaKey) {
      thetaMass = val;
    } else {
      result[key] = r * val;
    }
  }
  result[thetaKey] = 1 - r + r * thetaMass;

  return result;
}

/** Pretty-print a subset key: "A,B,C" → "{A, B, C}" */
export function formatSubset(key) {
  if (key.includes(',')) {
    return `{${key.split(',').join(', ')}}`;
  }
  return key;
}
