import { useState } from "react";
import "./App.css";

import GraphInput from "./components/GraphInput";
import GraphVisualization from "./components/GraphVisualization";
import { edmondsKarp } from "./algorithm/edmondsKarp";

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(-1);

  const [darkMode, setDarkMode] = useState(true);

  // =========================================
  // RUN ALGORITHM
  // =========================================

  const runAlgorithm = () => {
    if (nodes.length === 0) {
      alert("Please add some nodes first.");
      return;
    }

    if (edges.length === 0) {
      alert("Please add some edges first.");
      return;
    }

    if (!source || !destination) {
      alert("Please select source and destination.");
      return;
    }

    if (source === destination) {
      alert("Source and destination must be different.");
      return;
    }

    const algorithmResult = edmondsKarp(
      nodes,
      edges,
      source,
      destination
    );

    setResult(algorithmResult);
    setCurrentStep(-1);
  };

  // =========================================
  // NEXT STEP
  // =========================================

  const nextStep = () => {
    if (!result || result.steps.length === 0) {
      return;
    }

    setCurrentStep((prev) =>
      Math.min(prev + 1, result.steps.length - 1)
    );
  };

  // =========================================
  // PREVIOUS STEP
  // =========================================

  const previousStep = () => {
    if (!result) {
      return;
    }

    setCurrentStep((prev) =>
      Math.max(prev - 1, -1)
    );
  };

  // =========================================
  // RESET
  // =========================================

  const resetAlgorithm = () => {
    setResult(null);
    setCurrentStep(-1);
  };

  // =========================================
  // CLEAR EVERYTHING
  // =========================================

  const clearAll = () => {
    setNodes([]);
    setEdges([]);

    setSource("");
    setDestination("");

    setResult(null);
    setCurrentStep(-1);
  };

  const currentStepData =
    result &&
    currentStep >= 0 &&
    result.steps[currentStep]
      ? result.steps[currentStep]
      : null;

  return (
    <div
      className={`app ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >

      {/* =====================================
          TOP NAVBAR
      ====================================== */}

      <nav className="navbar">

        <div className="brand">

          <div className="brand-icon">
            FK
          </div>

          <div>
            <div className="brand-name">
              FLOW<span>LAB</span>
            </div>

            <div className="brand-subtitle">
              ALGORITHM VISUALIZER
            </div>
          </div>

        </div>


        <div className="navbar-right">

          <div className="system-status">
            <span className="status-dot"></span>
            SYSTEM ONLINE
          </div>

          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle theme"
          >
            <span className="theme-icon">
              {darkMode ? "☀" : "☾"}
            </span>

            <span>
              {darkMode ? "Light" : "Dark"}
            </span>
          </button>

        </div>

      </nav>


      {/* =====================================
          HERO
      ====================================== */}

      <header className="hero">

        <div className="hero-badge">
          <span></span>
          MAXIMUM FLOW / GRAPH THEORY
        </div>

        <h1>
          Edmonds<span>–</span>Karp
        </h1>

        <p>
          Explore maximum flow through an interactive
          visualization of BFS-based augmenting paths.
        </p>

      </header>


      {/* =====================================
          MAIN GRID
      ====================================== */}

      <main className="workspace">

        {/* ===================================
            LEFT PANEL
        ==================================== */}

        <aside className="control-panel">

          <div className="panel-heading">

            <div>
              <div className="section-label">
                01 / CONFIGURATION
              </div>

              <h2>
                Build Network
              </h2>
            </div>

            <div className="panel-number">
              01
            </div>

          </div>


          <GraphInput
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
            source={source}
            setSource={setSource}
            destination={destination}
            setDestination={setDestination}
          />


          <div className="panel-divider"></div>


          <button
            className="clear-button"
            onClick={clearAll}
          >
            <span>↻</span>
            Clear Network
          </button>

        </aside>


        {/* ===================================
            CENTER GRAPH
        ==================================== */}

        <section className="graph-panel">

          <div className="graph-topbar">

            <div>

              <div className="section-label">
                02 / VISUALIZATION
              </div>

              <h2>
                Flow Network
              </h2>

            </div>


            <div className="graph-metrics">

              <div className="metric">
                <span className="metric-value">
                  {nodes.length}
                </span>

                <span className="metric-label">
                  NODES
                </span>
              </div>


              <div className="metric">
                <span className="metric-value">
                  {edges.length}
                </span>

                <span className="metric-label">
                  EDGES
                </span>
              </div>

            </div>

          </div>


          <GraphVisualization
            nodes={nodes}
            edges={edges}
            source={source}
            destination={destination}
            result={result}
            currentStep={currentStep}
          />

        </section>

      </main>


      {/* =====================================
          ALGORITHM CONTROL BAR
      ====================================== */}

      <section className="algorithm-bar">

        <div className="algorithm-info">

          <div className="algorithm-icon">
            EK
          </div>

          <div>

            <div className="algorithm-title">
              Edmonds–Karp Engine
            </div>

            <div className="algorithm-description">
              Breadth-first search • Residual capacity
              • Augmenting paths
            </div>

          </div>

        </div>


        <div className="algorithm-actions">

          <button
            className="secondary-button"
            onClick={previousStep}
            disabled={
              !result || currentStep <= -1
            }
          >
            ← Previous
          </button>


          <button
            className="run-button"
            onClick={runAlgorithm}
          >
            <span>▶</span>
            Run Algorithm
          </button>


          <button
            className="secondary-button next-button"
            onClick={nextStep}
            disabled={
              !result ||
              currentStep >= result.steps.length - 1
            }
          >
            Next →
          </button>


          <button
            className="reset-button"
            onClick={resetAlgorithm}
            disabled={!result}
          >
            ↻
          </button>

        </div>

      </section>


      {/* =====================================
          STEP / RESULT SECTION
      ====================================== */}

      <section className="result-section">

        <div className="result-header">

          <div>

            <div className="section-label">
              03 / EXECUTION
            </div>

            <h2>
              Algorithm Monitor
            </h2>

          </div>


          {result && (
            <div className="step-counter">
              STEP{" "}
              <strong>
                {currentStep >= 0
                  ? currentStep + 1
                  : 0}
              </strong>
              {" / "}
              {result.steps.length}
            </div>
          )}

        </div>


        <div className="result-grid">

          {/* MAX FLOW */}

          <div className="result-card highlight-card">

            <div className="card-icon">
              ∞
            </div>

            <div className="result-card-label">
              MAXIMUM FLOW
            </div>

            <div className="max-flow-value">
              {result
                ? result.maxFlow
                : "—"}
            </div>

            <div className="result-card-subtitle">
              Total flow from source to sink
            </div>

          </div>


          {/* CURRENT PATH */}

          <div className="result-card">

            <div className="card-top">

              <div className="card-icon small">
                →
              </div>

              <div className="result-card-label">
                CURRENT PATH
              </div>

            </div>


            <div className="path-display">

              {currentStepData
                ? currentStepData.path.join("  →  ")
                : "Awaiting execution"}

            </div>

          </div>


          {/* BOTTLENECK */}

          <div className="result-card">

            <div className="card-top">

              <div className="card-icon small">
                ◈
              </div>

              <div className="result-card-label">
                BOTTLENECK
              </div>

            </div>


            <div className="data-value">

              {currentStepData
                ? currentStepData.bottleneck
                : "—"}

            </div>

            <div className="result-card-subtitle">
              Minimum residual capacity
            </div>

          </div>


          {/* FLOW ADDED */}

          <div className="result-card">

            <div className="card-top">

              <div className="card-icon small">
                +
              </div>

              <div className="result-card-label">
                FLOW ADDED
              </div>

            </div>


            <div className="data-value">

              {currentStepData
                ? `+${currentStepData.flowAdded}`
                : "—"}

            </div>

            <div className="result-card-subtitle">
              Flow added this iteration
            </div>

          </div>

        </div>


        {/* LEGEND */}

        <div className="legend">

          <div className="legend-title">
            VISUAL LEGEND
          </div>

          <div className="legend-item">
            <span className="legend-line purple"></span>
            Original edge
          </div>

          <div className="legend-item">
            <span className="legend-line yellow"></span>
            Current BFS path
          </div>

          <div className="legend-item">
            <span className="legend-line blue"></span>
            Residual edge
          </div>

          <div className="legend-item">
            <span className="legend-node source"></span>
            Source
          </div>

          <div className="legend-item">
            <span className="legend-node sink"></span>
            Destination
          </div>

        </div>

      </section>


      {/* =====================================
          FOOTER
      ====================================== */}

      <footer className="footer">

        <div>
          FLOWLAB / GRAPH ALGORITHM LABORATORY
        </div>

        <div>
          EDMONDS–KARP • BFS • MAXIMUM FLOW
        </div>

      </footer>

    </div>
  );
}

export default App;