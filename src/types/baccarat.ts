export type Outcome = 'B' | 'P' | 'T';

export interface RunInfo {
  result: 'B' | 'P';
  length: number;
}

export interface RunLengthCount {
  length: number;
  count: number;
}

export interface ShoeAnalysis {
  hands: number;
  banker: number;
  player: number;
  ties: number;
  decidedHands: number;

  longestBankerRun: number;
  longestPlayerRun: number;
  longestRun: number;

  transitions: number;
  transitionRate: number;

  threeFourRuns: number;
  threeFourRunShare: number;

  imbalance: number;
  imbalancePercent: number;

  runs: RunInfo[];
  runLengthCounts: RunLengthCount[];

  classification: string;
}

export interface PatternResult {
  pattern: string;

  occurrences: number;
  containsPattern: boolean;

  firstOccurrenceHand: number | null;
  averageOccurrenceHand: number | null;

  early: number;
  middle: number;
  late: number;

  nextBanker: number;
  nextPlayer: number;
  nextTie: number;
  nextAvailable: number;
}

export interface PatternPreset {
  pattern: string;
  label: string;
  description: string;
}