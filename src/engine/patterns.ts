import type { PatternPreset } from '../types/baccarat';

export const PATTERN_PRESETS: PatternPreset[] = [
  {
    pattern: 'BBB',
    label: 'Banker 3-run',
    description: 'Three consecutive Banker results.',
  },
  {
    pattern: 'BBBB',
    label: 'Banker 4-run',
    description: 'Four consecutive Banker results.',
  },
  {
    pattern: 'BBBBB',
    label: 'Banker 5-run',
    description: 'Five consecutive Banker results.',
  },
  {
    pattern: 'PPP',
    label: 'Player 3-run',
    description: 'Three consecutive Player results.',
  },
  {
    pattern: 'PPPP',
    label: 'Player 4-run',
    description: 'Four consecutive Player results.',
  },
  {
    pattern: 'PPPPP',
    label: 'Player 5-run',
    description: 'Five consecutive Player results.',
  },
  {
    pattern: 'BP',
    label: 'Banker → Player',
    description: 'One Banker followed by Player.',
  },
  {
    pattern: 'PB',
    label: 'Player → Banker',
    description: 'One Player followed by Banker.',
  },
  {
    pattern: 'BPBP',
    label: 'Alternating BPBP',
    description: 'Four alternating decided results.',
  },
  {
    pattern: 'PBPB',
    label: 'Alternating PBPB',
    description: 'Four alternating decided results.',
  },
  {
    pattern: 'BBPP',
    label: 'BBPP',
    description: 'Two Banker followed by two Player.',
  },
  {
    pattern: 'PPBB',
    label: 'PPBB',
    description: 'Two Player followed by two Banker.',
  },
  {
    pattern: 'BBBP',
    label: 'BBBP',
    description: 'Three Banker followed by Player.',
  },
  {
    pattern: 'PPPB',
    label: 'PPPB',
    description: 'Three Player followed by Banker.',
  },
  {
    pattern: 'BBBPB',
    label: 'BBBPB',
    description: 'Three Banker, Player, Banker.',
  },
  {
    pattern: 'PPBPB',
    label: 'PPBPB',
    description: 'Two Player, Banker, Player, Banker.',
  },
];

export function normalizePattern(value: string): string {
  return value
    .toUpperCase()
    .replace(/[^BPT]/g, '');
}