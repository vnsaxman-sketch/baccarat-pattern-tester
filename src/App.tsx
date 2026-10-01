import { useMemo, useState } from 'react';
import ShoeInput from './components/ShoeInput';
import AnalysisPanel from './components/AnalysisPanel';
import PatternPanel from './components/PatternPanel';
import MonteCarloPanel from './components/MonteCarloPanel';
import type { Outcome, PatternPreset, ShoeAnalysis } from './types/baccarat';
import { analyzeShoe } from './engine/analysis';
import { PATTERN_PRESETS } from './engine/patterns';

const EMPTY_SHOE: Outcome[] = [];

export default function App() {
  const [shoe, setShoe] = useState<Outcome[]>(EMPTY_SHOE);
  const [selectedPattern, setSelectedPattern] = useState<string>('BBBP');
  const [customPattern, setCustomPattern] = useState<string>('');
  const [sampleLoaded, setSampleLoaded] = useState(false);

  const analysis: ShoeAnalysis = useMemo(
    () => analyzeShoe(shoe),
    [shoe],
  );

  const selectedPreset: PatternPreset | undefined =
    PATTERN_PRESETS.find(
      (item) => item.pattern === selectedPattern,
    );

  function addOutcome(outcome: Outcome) {
    if (shoe.length >= 80) return;

    setShoe((current) => [...current, outcome]);
    setSampleLoaded(false);
  }

  function undo() {
    setShoe((current) => current.slice(0, -1));
    setSampleLoaded(false);
  }

  function clearShoe() {
    setShoe([]);
    setSampleLoaded(false);
  }

  function loadSample() {
    const sample =
      'BBBPBPBBPPBPBPPBBBPBPPPBPPBPPBBPBBPPBPBPPBBBPBPBPPBPBBPPBBPBPBBBPBBPPBPB';

    setShoe(sample.split('') as Outcome[]);
    setSampleLoaded(true);
  }

  const activePattern = customPattern.trim()
    ? customPattern
        .trim()
        .toUpperCase()
        .replace(/[^BPT]/g, '')
    : selectedPattern;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <div className="eyebrow">
            FINITE 8-DECK RESEARCH TOOL
          </div>

          <h1>Baccarat Pattern Tester</h1>

          <p>
            Enter a shoe by hand, inspect its structure, and
            compare preferred patterns against finite 8-deck
            Monte Carlo samples.
          </p>
	  <br />
	  <p>
	    Developed by Long Nguyen
	  </p>
        </div>

        <div className="header-badge">
          68–80 hands
        </div>
      </header>

      <main className="content">
        <section className="notice">
          <strong>Research / education only.</strong>{' '}
          Pattern frequencies describe historical or simulated
          structure. They do not establish that the next baccarat
          result is predictable or that a betting strategy has
          positive expected value.
        </section>

        <ShoeInput
          shoe={shoe}
          onAdd={addOutcome}
          onUndo={undo}
          onClear={clearShoe}
          onLoadSample={loadSample}
          sampleLoaded={sampleLoaded}
        />

        <AnalysisPanel analysis={analysis} />

        <PatternPanel
          shoe={shoe}
          pattern={activePattern}
          selectedPreset={selectedPreset}
          selectedPattern={selectedPattern}
          customPattern={customPattern}
          onSelectedPatternChange={setSelectedPattern}
          onCustomPatternChange={setCustomPattern}
        />

        <MonteCarloPanel pattern={activePattern} />
      </main>

      <footer className="footer">
        <span>
          Finite 8-deck baccarat pattern testing
        </span>

        <span>•</span>

        <span>
          Static browser application — no database required
        </span>
      </footer>
    </div>
  );
}