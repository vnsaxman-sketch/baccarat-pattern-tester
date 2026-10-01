import { findPattern } from './analysis';
import { simulateShoe } from './baccarat';

export interface MonteCarloResult {
  simulations: number;
  targetHands: number;
  pattern: string;

  shoesWithPattern: number;
  occurrenceRate: number;

  averageOccurrences: number;
  medianOccurrences: number;
  maxOccurrences: number;

  earlyOccurrences: number;
  middleOccurrences: number;
  lateOccurrences: number;

  nextBanker: number;
  nextPlayer: number;
  nextTie: number;
  nextAvailable: number;

  longestRunDistribution:
    Record<number, number>;

  averageTransitionRate: number;
  averageThreeFourRunShare: number;
}

export function runMonteCarlo(
  simulations: number,
  targetHands: number,
  pattern: string,
  onProgress?: (
    completed: number,
  ) => void,
): MonteCarloResult {
  const occurrenceCounts: number[] = [];

  let shoesWithPattern = 0;

  let earlyOccurrences = 0;
  let middleOccurrences = 0;
  let lateOccurrences = 0;

  let nextBanker = 0;
  let nextPlayer = 0;
  let nextTie = 0;
  let nextAvailable = 0;

  let transitionTotal = 0;
  let threeFourTotal = 0;

  const longestRunDistribution:
    Record<number, number> = {};

  for (
    let i = 0;
    i < simulations;
    i += 1
  ) {
    const shoe =
      simulateShoe(
        targetHands,
      );

    const patternResult =
      findPattern(
        shoe,
        pattern,
      );

    occurrenceCounts.push(
      patternResult.occurrences,
    );

    if (
      patternResult.containsPattern
    ) {
      shoesWithPattern += 1;
    }

    earlyOccurrences +=
      patternResult.early;

    middleOccurrences +=
      patternResult.middle;

    lateOccurrences +=
      patternResult.late;

    nextBanker +=
      patternResult.nextBanker;

    nextPlayer +=
      patternResult.nextPlayer;

    nextTie +=
      patternResult.nextTie;

    nextAvailable +=
      patternResult.nextAvailable;

    const sequence =
      shoe.filter(
        (
          x,
        ): x is 'B' | 'P' =>
          x !== 'T',
      );

    let runs = 0;
    let transitions = 0;
    let threeFour = 0;

    if (sequence.length) {
      let current =
        sequence[0];

      let length = 1;

      for (
        let j = 1;
        j < sequence.length;
        j += 1
      ) {
        if (
          sequence[j] ===
          current
        ) {
          length += 1;
        } else {
          runs += 1;

          if (
            length === 3 ||
            length === 4
          ) {
            threeFour += 1;
          }

          transitions += 1;

          current =
            sequence[j];

          length = 1;
        }
      }

      runs += 1;

      if (
        length === 3 ||
        length === 4
      ) {
        threeFour += 1;
      }

      transitionTotal +=
        sequence.length > 1
          ? transitions /
            (sequence.length - 1)
          : 0;

      threeFourTotal +=
        runs
          ? threeFour / runs
          : 0;

      const longest =
        Math.max(
          ...getRunLengths(
            sequence,
          ),
        );

      longestRunDistribution[
        longest
      ] =
        (
          longestRunDistribution[
            longest
          ] ?? 0
        ) + 1;
    }

    if (
      onProgress &&
      (
        (i + 1) %
          Math.max(
            1,
            Math.floor(
              simulations / 100,
            ),
          ) ===
          0
      )
    ) {
      onProgress(i + 1);
    }
  }

  const sorted =
    [...occurrenceCounts].sort(
      (a, b) => a - b,
    );

  const medianOccurrences =
    sorted.length % 2
      ? sorted[
          Math.floor(
            sorted.length / 2,
          )
        ]
      : (
          sorted[
            sorted.length / 2 - 1
          ] +
          sorted[
            sorted.length / 2
          ]
        ) / 2;

  return {
    simulations,
    targetHands,
    pattern,

    shoesWithPattern,

    occurrenceRate:
      shoesWithPattern /
      simulations,

    averageOccurrences:
      occurrenceCounts.reduce(
        (sum, value) =>
          sum + value,
        0,
      ) / simulations,

    medianOccurrences,

    maxOccurrences:
      Math.max(
        ...occurrenceCounts,
        0,
      ),

    earlyOccurrences,
    middleOccurrences,
    lateOccurrences,

    nextBanker,
    nextPlayer,
    nextTie,
    nextAvailable,

    longestRunDistribution,

    averageTransitionRate:
      transitionTotal /
      simulations,

    averageThreeFourRunShare:
      threeFourTotal /
      simulations,
  };
}

function getRunLengths(
  sequence: Array<'B' | 'P'>,
): number[] {
  if (!sequence.length) {
    return [];
  }

  const result: number[] = [];

  let length = 1;

  for (
    let i = 1;
    i < sequence.length;
    i += 1
  ) {
    if (
      sequence[i] ===
      sequence[i - 1]
    ) {
      length += 1;
    } else {
      result.push(length);

      length = 1;
    }
  }

  result.push(length);

  return result;
}