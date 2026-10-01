import type {
  ShoeAnalysis,
} from '../types/baccarat';

interface Props {
  analysis: ShoeAnalysis;
}

export default function AnalysisPanel({
  analysis,
}: Props) {
  return (
    <section className="panel">
      <h2>
        2. Shoe structure
      </h2>

      <p className="panel-subtitle">
        Descriptive statistics for the
        manually entered shoe.
      </p>

      <div className="stat-grid">
        <Stat
          label="Hands"
          value={analysis.hands.toString()}
        />

        <Stat
          label="Banker"
          value={analysis.banker.toString()}
        />

        <Stat
          label="Player"
          value={analysis.player.toString()}
        />

        <Stat
          label="Tie"
          value={analysis.ties.toString()}
        />

        <Stat
          label="Longest B run"
          value={analysis.longestBankerRun.toString()}
        />

        <Stat
          label="Longest P run"
          value={analysis.longestPlayerRun.toString()}
        />

        <Stat
          label="Transition rate"
          value={`${(
            analysis.transitionRate * 100
          ).toFixed(1)}%`}
        />

        <Stat
          label="3–4 run share"
          value={`${(
            analysis.threeFourRunShare * 100
          ).toFixed(1)}%`}
        />
      </div>

      <div className="classification">
        <strong>
          Descriptive classification
        </strong>

        <span>
          {analysis.classification}
        </span>

        <div
          className="muted"
          style={{ marginTop: 6 }}
        >
          These labels are heuristic
          structure descriptions, not
          predictions.
        </div>
      </div>

      <div
        className="two-column"
        style={{ marginTop: 18 }}
      >
        <div className="table-wrap">
          <h3>
            Run lengths
          </h3>

          <table>
            <thead>
              <tr>
                <th>
                  Length
                </th>

                <th>
                  Count
                </th>
              </tr>
            </thead>

            <tbody>
              {analysis.runLengthCounts.length ? (
                analysis.runLengthCounts.map(
                  (row) => (
                    <tr
                      key={row.length}
                    >
                      <td>
                        {row.length}
                      </td>

                      <td>
                        {row.count}
                      </td>
                    </tr>
                  ),
                )
              ) : (
                <tr>
                  <td colSpan={2}>
                    No B/P results yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div>
          <h3>
            Balance
          </h3>

          <p>
            Banker − Player:{' '}
            <strong>
              {analysis.imbalance}
            </strong>
          </p>

          <p>
            Absolute imbalance:{' '}
            <strong>
              {(
                analysis.imbalancePercent *
                100
              ).toFixed(1)}
              %
            </strong>
          </p>

          <p>
            B/P transitions:{' '}
            <strong>
              {analysis.transitions}
            </strong>
          </p>

          <p>
            3–4 length runs:{' '}
            <strong>
              {analysis.threeFourRuns}
            </strong>
          </p>
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