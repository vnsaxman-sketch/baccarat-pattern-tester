import type { Outcome } from '../types/baccarat';

interface Props {
  shoe: Outcome[];

  onAdd: (
    outcome: Outcome,
  ) => void;

  onUndo: () => void;
  onClear: () => void;
  onLoadSample: () => void;

  sampleLoaded: boolean;
}

export default function ShoeInput({
  shoe,
  onAdd,
  onUndo,
  onClear,
  onLoadSample,
  sampleLoaded,
}: Props) {
  return (
    <section className="panel">
      <h2>
        1. Enter shoe results by hand
      </h2>

      <p className="panel-subtitle">
        Each button adds one hand. Ties
        are recorded but are skipped when
        calculating B/P run structure and
        pattern matching.
      </p>

      <div className="controls">
        <button
          className="outcome-button b"
          onClick={() => onAdd('B')}
        >
          Banker
        </button>

        <button
          className="outcome-button p"
          onClick={() => onAdd('P')}
        >
          Player
        </button>

        <button
          className="outcome-button t"
          onClick={() => onAdd('T')}
        >
          Tie
        </button>

        <button
          className="secondary-button"
          onClick={onUndo}
          disabled={!shoe.length}
        >
          Undo
        </button>

        <button
          className="danger-button"
          onClick={onClear}
          disabled={!shoe.length}
        >
          Clear
        </button>

        <button
          className="secondary-button"
          onClick={onLoadSample}
        >
          {sampleLoaded
            ? 'Sample loaded'
            : 'Load sample'}
        </button>
      </div>

      <div className="shoe-grid">
        {Array.from(
          { length: 80 },
          (_, index) => {
            const outcome =
              shoe[index];

            return (
              <div
                className="hand-cell"
                key={index}
              >
                <span className="hand-number">
                  {index + 1}
                </span>

                <span
                  className={
                    outcome
                      ? `hand-result ${outcome.toLowerCase()}`
                      : 'empty-cell'
                  }
                >
                  {outcome ?? '·'}
                </span>
              </div>
            );
          },
        )}
      </div>

      <p className="muted">
        {shoe.length} of 80 hand
        positions entered.
      </p>
    </section>
  );
}