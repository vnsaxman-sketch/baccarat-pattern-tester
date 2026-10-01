import type {
  Outcome,
  PatternResult,
  RunInfo,
  ShoeAnalysis,
} from '../types/baccarat';

export function decidedSequence(
  shoe: Outcome[],
): Array<'B' | 'P'> {
  return shoe.filter(
    (value): value is 'B' | 'P' =>
      value === 'B' || value === 'P',
  );
}

export function getRuns(
  sequence: Array<'B' | 'P'>,
): RunInfo[] {
  if (sequence.length === 0) {
    return [];
  }

  const runs: RunInfo[] = [];

  let current = sequence[0];
  let length = 1;

  for (let i = 1; i < sequence.length; i += 1) {
    if (sequence[i] === current) {
      length += 1;
    } else {
      runs.push({
        result: current,
        length,
      });

      current = sequence[i];
      length = 1;
    }
  }

  runs.push({
    result: current,
    length,
  });

  return runs;
}

export function analyzeShoe(
  shoe: Outcome[],
): ShoeAnalysis {
  const banker = shoe.filter(
    (x) => x === 'B',
  ).length;

  const player = shoe.filter(
    (x) => x === 'P',
  ).length;

  const ties = shoe.filter(
    (x) => x === 'T',
  ).length;

  const sequence = decidedSequence(shoe);

  const runs = getRuns(sequence);

  const transitions = Math.max(
    0,
    runs.length - 1,
  );

  const transitionRate =
    sequence.length > 1
      ? transitions / (sequence.length - 1)
      : 0;

  const longestBankerRun = Math.max(
    0,
    ...runs
      .filter((r) => r.result === 'B')
      .map((r) => r.length),
  );

  const longestPlayerRun = Math.max(
    0,
    ...runs
      .filter((r) => r.result === 'P')
      .map((r) => r.length),
  );

  const longestRun = Math.max(
    longestBankerRun,
    longestPlayerRun,
  );

  const threeFourRuns = runs.filter(
    (r) =>
      r.length === 3 ||
      r.length === 4,
  ).length;

  const threeFourRunShare =
    runs.length
      ? threeFourRuns / runs.length
      : 0;

  const imbalance = banker - player;

  const imbalancePercent =
    sequence.length
      ? Math.abs(imbalance) / sequence.length
      : 0;

  const runLengthCounts = Array.from(
    new Set(
      runs.map((r) => r.length),
    ),
  )
    .sort((a, b) => a - b)
    .map((length) => ({
      length,
      count: runs.filter(
        (r) => r.length === length,
      ).length,
    }));

  const classification = classifyShoe({
    transitionRate,
    longestRun,
    threeFourRunShare,
    imbalancePercent,
    hands: shoe.length,
  });

  return {
    hands: shoe.length,
    banker,
    player,
    ties,

    decidedHands: sequence.length,

    longestBankerRun,
    longestPlayerRun,
    longestRun,

    transitions,
    transitionRate,

    threeFourRuns,
    threeFourRunShare,

    imbalance,
    imbalancePercent,

    runs,
    runLengthCounts,

    classification,
  };
}

function classifyShoe(input: {
  transitionRate: number;
  longestRun: number;
  threeFourRunShare: number;
  imbalancePercent: number;
  hands: number;
}): string {
  if (input.hands < 20) {
    return 'Too little data for a useful shoe classification.';
  }

  if (input.transitionRate >= 0.60) {
    return 'Choppy-like structure';
  }

  if (input.longestRun >= 10) {
    return 'Strong long-run structure';
  }

  if (input.longestRun >= 8) {
    return 'Elevated long-run structure';
  }

  if (input.threeFourRunShare >= 0.30) {
    return 'Elevated 3–4 run structure';
  }

  if (input.imbalancePercent >= 0.20) {
    return 'Directional imbalance structure';
  }

  if (input.longestRun >= 7) {
    return 'Moderate streak structure';
  }

  return 'Baseline / noise-like structure';
}

export function findPattern(
  shoe: Outcome[],
  rawPattern: string,
): PatternResult {
  const pattern = rawPattern
    .toUpperCase()
    .replace(/[^BPT]/g, '');

  const sequence = decidedSequence(shoe);

  if (
    !pattern ||
    pattern.length > sequence.length
  ) {
    return {
      pattern,
      occurrences: 0,
      containsPattern: false,

      firstOccurrenceHand: null,
      averageOccurrenceHand: null,

      early: 0,
      middle: 0,
      late: 0,

      nextBanker: 0,
      nextPlayer: 0,
      nextTie: 0,
      nextAvailable: 0,
    };
  }

  const occurrences: number[] = [];
  const next: Outcome[] = [];

  for (
    let i = 0;
    i <= sequence.length - pattern.length;
    i += 1
  ) {
    let matches = true;

    for (
      let j = 0;
      j < pattern.length;
      j += 1
    ) {
      if (
        sequence[i + j] !== pattern[j]
      ) {
        matches = false;
        break;
      }
    }

    if (matches) {
      occurrences.push(i);

      const following =
        sequence[i + pattern.length];

      if (following) {
        next.push(following);
      }
    }
  }

  const first =
    occurrences.length
      ? occurrences[0] + 1
      : null;

  const average =
    occurrences.length
      ? occurrences.reduce(
          (sum, value) =>
            sum + value + 1,
          0,
        ) / occurrences.length
      : null;

  const denominator = Math.max(
    1,
    sequence.length -
      pattern.length +
      1,
  );

  const early = occurrences.filter(
    (i) => i < denominator / 3,
  ).length;

  const middle = occurrences.filter(
    (i) =>
      i >= denominator / 3 &&
      i < (2 * denominator) / 3,
  ).length;

  const late = occurrences.filter(
    (i) =>
      i >= (2 * denominator) / 3,
  ).length;

  return {
    pattern,

    occurrences:
      occurrences.length,

    containsPattern:
      occurrences.length > 0,

    firstOccurrenceHand: first,

    averageOccurrenceHand:
      average,

    early,
    middle,
    late,

    nextBanker: next.filter(
      (x) => x === 'B',
    ).length,

    nextPlayer: next.filter(
      (x) => x === 'P',
    ).length,

    nextTie: next.filter(
      (x) => x === 'T',
    ).length,

    nextAvailable: next.length,
  };
}