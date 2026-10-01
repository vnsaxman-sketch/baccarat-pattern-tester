import { useMemo } from 'react';

import { findPattern } from '../engine/analysis';
import { PATTERN_PRESETS } from '../engine/patterns';

import type {
  PatternPreset,
  Outcome,
} from '../types/baccarat';

interface Props {
  shoe: Outcome[];

  pattern: string;

  selectedPreset?: PatternPreset;

  selectedPattern: string;

  customPattern: string;

  onSelectedPatternChange: (
    value: string,
  ) => void;

  onCustomPatternChange: (
    value: string,
  ) => void;
}

export default function PatternPanel({
  shoe,
  pattern,
  selectedPreset,
  selectedPattern,
  customPattern,
  onSelectedPatternChange,
  onCustomPatternChange,
}: Props) {
  const result = useMemo(
    () =>
      findPattern(
        shoe,
        pattern,
      ),
    [shoe, pattern],
  );

  return (
    <section className="panel">
      <h2>
        3. Preferred pattern testing
      </h2>

      <p className="panel-subtitle">
        Select a commonly tested pattern
        or type your own B/P/T sequence.
      </p>

      <div className="pattern-controls">
        <div className="field">
          <label htmlFor="patternPreset">
            Pattern preset
          </label>

          <select
            id="patternPreset"
            value={selectedPattern}
            onChange={(event) => {
              onSelectedPatternChange(
                event.target.value,
              );

              onCustomPatternChange('');
            }}
          >
            {PATTERN_PRESETS.map(
              (preset) => (
                <option
                  key={preset.pattern}
                  value={preset.pattern}
                >
                  {preset.label} —{' '}
                  {preset.pattern}
                </option>
              ),
            )}
          </select>
        </div>

        <div className="field">
          <label htmlFor="customPattern">
            Custom pattern
          </label>

          <input
            id="customPattern"
            value={customPattern}
            onChange={(event) =>
              onCustomPatternChange(
                event.target.value,
              )
            }
            placeholder="Example: BBBP"
            maxLength={20}
          />
        </div>
      </div>

      <div className="pattern-preview">
        Testing:{' '}
        {result.pattern || '—'}

        {selectedPreset &&
          !customPattern && (
            <span
              className="muted"
              style={{
                marginLeft: 16,
                letterSpacing: 0,
              }}
            >
              {
                selectedPreset.description
              }
            </span>
          )}
      </div>

      <div
        className="stat-grid"
        style={{ marginTop: 14 }}
      >
        <Stat
          label="Occurrences"
          value={result.occurrences.toString()}
        />

        <Stat
          label="First occurrence"
          value={
            result.firstOccurrenceHand?.toString() ??
            '—'
          }
        />

        <Stat
          label="Average position"
          value={
            result.averageOccurrenceHand?.toFixed(
              1,
            ) ?? '—'
          }
        />

        <Stat
          label="Next-result samples"
          value={result.nextAvailable.toString()}
        />
      </div>

      <div
        className="two-column"
        style={{ marginTop: 18 }}
      >
        <div>
          <h3>
            Where it occurred
          </h3>

          <MiniBar
            label="Early"
            value={result.early}
            max={Math.max(
              1,
              result.occurrences,
            )}
          />

          <MiniBar
            label="Middle"
            value={result.middle}
            max={Math.max(
              1,
              result.occurrences,
            )}
          />

          <MiniBar
            label="Late"
            value={result.late}
            max={Math.max(
              1,
              result.occurrences,
            )}
          />
        </div>

        <div>
          <h3>
            Observed following result
          </h3>

          {result.nextAvailable ===
          0 ? (
            <p className="muted">
              No following hand is
              available after an
              occurrence yet.
            </p>
          ) : (
            <>
              <p>
                Banker:{' '}
                <strong>
                  {result.nextBanker}
                </strong>
              </p>

              <p>
                Player:{' '}
                <strong>
                  {result.nextPlayer}
                </strong>
              </p>

              <p>
                Tie:{' '}
                <strong>
                  {result.nextTie}
                </strong>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-label">
        {label}
      </div>

      <div className="stat-value">
        {value}
      </div>
    </div>
  );
}

function MiniBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const percent = Math.min(
    100,
    (value / max) * 100,
  );

  return (
    <div className="mini-bar">
      <div>
        <div className="muted">
          {label}: {value}
        </div>

        <div className="progress">
          <div
            style={{
              width: `${percent}%`,
            }}
          />
        </div>
      </div>

      <strong>
        {value}
      </strong>
    </div>
  );
}