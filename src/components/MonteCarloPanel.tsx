import {
  useEffect,
  useState,
} from 'react';

import {
  runMonteCarlo,
  type MonteCarloResult,
} from '../engine/monteCarlo';

interface Props {
  pattern: string;
}

export default function MonteCarloPanel({
  pattern,
}: Props) {
  const [hands, setHands] =
    useState(72);

  const [simulations, setSimulations] =
    useState(10000);

  const [running, setRunning] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [result, setResult] =
    useState<MonteCarloResult | null>(
      null,
    );

  useEffect(() => {
    setResult(null);
    setProgress(0);
  }, [pattern]);

  function run() {
    if (!pattern) {
      return;
    }

    setRunning(true);
    setProgress(0);

    /*
     * Give React a chance to render
     * the running state before the
     * synchronous simulation begins.
     */

    window.setTimeout(() => {
      const output =
        runMonteCarlo(
          simulations,
          hands,
          pattern,
          (completed) => {
            setProgress(
              (completed /
                simulations) *
                100,
            );
          },
        );

      setResult(output);

      setProgress(100);

      setRunning(false);
    }, 30);
  }

  return (
    <section className="panel">
      <h2>
        4. Finite 8-deck Monte Carlo
      </h2>

      <p className="panel-subtitle">
        This runs the baccarat dealing
        rules locally in your browser.
        Start with 1,000–10,000
        simulations while testing the
        app; larger samples take longer
        on a phone.
      </p>

      <div className="pattern-controls">
        <div className="field">
          <label htmlFor="handCount">
            Target hands per shoe
          </label>

          <select
            id="handCount"
            value={hands}
            onChange={(event) =>
              setHands(
                Number(
                  event.target.value,
                ),
              )
            }
          >
            <option value={68}>
              68
            </option>

            <option value={72}>
              72
            </option>

            <option value={76}>
              76
            </option>

            <option value={80}>
              80
            </option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="simulationCount">
            Simulations
          </label>

          <select
            id="simulationCount"
            value={simulations}
            onChange={(event) =>
              setSimulations(
                Number(
                  event.target.value,
                ),
              )
            }
          >
            <option value={1000}>
              1,000
            </option>

            <option value={5000}>
              5,000
            </option>

            <option value={10000}>
              10,000
            </option>

            <option value={50000}>
              50,000
            </option>

            <option value={100000}>
              100,000
            </option>
          </select>
        </div>
      </div>

      <div
        style={{ marginTop: 14 }}
        className="controls"
      >
        <button
          className="primary-button"
          onClick={run}
          disabled={
            running || !pattern
          }
        >
          {running
            ? 'Running…'
            : `Test ${
                pattern ||
                'pattern'
              }`}
        </button>
      </div>

      {running && (
        <div
          style={{ marginTop: 14 }}
        >
          <div className="progress">
            <div
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <p className="muted">
            {progress.toFixed(0)}%
            complete
          </p>
        </div>
      )}

      {result && (
        <div className="result-callout">
          <div className="stat-grid">
            <Stat
              label="Shoes containing pattern"
              value={`${(
                result.occurrenceRate *
                100
              ).toFixed(2)}%`}
            />

            <Stat
              label="Average occurrences/shoe"
              value={result.averageOccurrences.toFixed(
                3,
              )}
            />

            <Stat
              label="Median occurrences"
              value={result.medianOccurrences.toString()}
            />

            <Stat
              label="Maximum observed"
              value={result.maxOccurrences.toString()}
            />
          </div>

          <div
            className="two-column"
            style={{
              marginTop: 18,
            }}
          >
            <div>
              <h3>
                Occurrence position
              </h3>

              <p>
                Early:{' '}
                <strong>
                  {
                    result.earlyOccurrences
                  }
                </strong>
              </p>

              <p>
                Middle:{' '}
                <strong>
                  {
                    result.middleOccurrences
                  }
                </strong>
              </p>

              <p>
                Late:{' '}
                <strong>
                  {
                    result.lateOccurrences
                  }
                </strong>
              </p>
            </div>

            <div>
              <h3>
                Following result
              </h3>

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

              <p>
                Available follow-ups:{' '}
                <strong>
                  {
                    result.nextAvailable
                  }
                </strong>
              </p>
            </div>
          </div>

          <div
            style={{ marginTop: 18 }}
          >
            <h3>
              Background shoe structure
            </h3>

            <p>
              Average B/P transition
              rate:{' '}
              <strong>
                {(
                  result.averageTransitionRate *
                  100
                ).toFixed(2)}
                %
              </strong>
            </p>

            <p>
              Average 3–4 run share:{' '}
              <strong>
                {(
                  result.averageThreeFourRunShare *
                  100
                ).toFixed(2)}
                %
              </strong>
            </p>
          </div>

          <div
            className="table-wrap"
            style={{
              marginTop: 18,
            }}
          >
            <h3>
              Longest B/P run
              distribution
            </h3>

            <table>
              <thead>
                <tr>
                  <th>
                    Longest run
                  </th>

                  <th>
                    Shoes
                  </th>

                  <th>
                    Percent
                  </th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(
                  result.longestRunDistribution,
                )
                  .sort(
                    ([a], [b]) =>
                      Number(a) -
                      Number(b),
                  )
                  .map(
                    ([
                      length,
                      count,
                    ]) => (
                      <tr
                        key={length}
                      >
                        <td>
                          {length}
                        </td>

                        <td>
                          {count}
                        </td>

                        <td>
                          {(
                            (count /
                              result.simulations) *
                            100
                          ).toFixed(
                            2,
                          )}
                          %
                        </td>
                      </tr>
                    ),
                  )}
              </tbody>
            </table>
          </div>
        </div>
      )}
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