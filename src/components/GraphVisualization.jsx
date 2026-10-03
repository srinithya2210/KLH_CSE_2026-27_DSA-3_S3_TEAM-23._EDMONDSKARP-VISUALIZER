import { useMemo } from "react";

import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  Position,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

function GraphVisualization({
  nodes,
  edges,
  source,
  destination,
  result,
  currentStep,
}) {

  // =========================================
  // NODE POSITIONS
  // =========================================

  const positions = useMemo(() => {

    const resultPositions = {};

    if (nodes.length === 0) {
      return resultPositions;
    }

    /*
      Layout:

            B ─────→ D ─────→ E
           ↗        ↓        ↗
      A ─────────→ C ─────→ F

      Source stays on the left.
      Destination stays on the right.
    */

    if (source) {
      resultPositions[source] = {
        x: 80,
        y: 260,
      };
    }

    if (destination) {
      resultPositions[destination] = {
        x: 900,
        y: 260,
      };
    }

    const middleNodes = nodes.filter(
      (node) =>
        node !== source &&
        node !== destination
    );

    middleNodes.forEach((node, index) => {

      const column = index % 2;
      const row = Math.floor(index / 2);

      resultPositions[node] = {
        x: 360 + column * 250,
        y: 140 + row * 220,
      };

    });

    // Fallback positions
    nodes.forEach((node, index) => {

      if (!resultPositions[node]) {

        resultPositions[node] = {
          x: 120 + (index % 3) * 280,
          y: 150 + Math.floor(index / 3) * 200,
        };

      }

    });

    return resultPositions;

  }, [nodes, source, destination]);


  // =========================================
  // CURRENT STEP
  // =========================================

  const currentStepData = useMemo(() => {

    if (
      !result ||
      currentStep < 0 ||
      !result.steps ||
      !result.steps[currentStep]
    ) {
      return null;
    }

    return result.steps[currentStep];

  }, [result, currentStep]);


  // =========================================
  // CURRENT BFS PATH
  // =========================================

  const currentPath =
    currentStepData?.path || [];


  // =========================================
  // CHECK PATH EDGE
  // =========================================

  const isPathEdge = (from, to) => {

    for (
      let i = 0;
      i < currentPath.length - 1;
      i++
    ) {

      if (
        currentPath[i] === from &&
        currentPath[i + 1] === to
      ) {
        return true;
      }

    }

    return false;

  };


  // =========================================
  // RESIDUAL CAPACITY
  // =========================================

  const getResidualCapacity = (from, to) => {

    if (!currentStepData) {
      return null;
    }

    const edge =
      currentStepData.residualGraph.find(
        (item) =>
          item.from === from &&
          item.to === to
      );

    return edge
      ? edge.capacity
      : 0;

  };


  // =========================================
  // CHECK ORIGINAL EDGE
  // =========================================

  const isOriginalEdge = (from, to) => {

    return edges.some(
      (edge) =>
        edge.from === from &&
        edge.to === to
    );

  };


  // =========================================
  // CREATE NODES
  // =========================================

  const flowNodes = useMemo(() => {

    return nodes.map((node) => {

      const isSource =
        node === source;

      const isDestination =
        node === destination;

      const isCurrentPath =
        currentPath.includes(node);


      let border = "#8b5cf6";
      let background = "#121625";

      let shadow =
        "0 0 22px rgba(139, 92, 246, 0.18)";


      // SOURCE
      if (isSource) {

        border = "#22c55e";

        background = "#10251a";

        shadow =
          "0 0 28px rgba(34, 197, 94, 0.30)";

      }


      // DESTINATION
      if (isDestination) {

        border = "#ef4444";

        background = "#281418";

        shadow =
          "0 0 28px rgba(239, 68, 68, 0.30)";

      }


      // CURRENT BFS PATH
      if (isCurrentPath) {

        border = "#facc15";

        background = "#29240b";

        shadow =
          "0 0 32px rgba(250, 204, 21, 0.38)";

      }


      return {

        id: node,

        position:
          positions[node] || {
            x: 100,
            y: 250,
          },

        data: {
          label: node,
        },

        sourcePosition:
          Position.Right,

        targetPosition:
          Position.Left,

        draggable: false,

        style: {

          width: 66,
          height: 66,

          borderRadius: "50%",

          border:
            `3px solid ${border}`,

          background,

          color: "#ffffff",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          fontSize: "19px",

          fontWeight: "800",

          boxShadow: shadow,

        },

      };

    });

  }, [
    nodes,
    positions,
    source,
    destination,
    currentPath,
  ]);


  // =========================================
  // CREATE EDGES
  // =========================================

  const flowEdges = useMemo(() => {

    const visualEdges = [];


    // =======================================
    // ORIGINAL EDGES
    // =======================================

    edges.forEach((edge, index) => {

      const highlighted =
        isPathEdge(
          edge.from,
          edge.to
        );


      const remaining =
        getResidualCapacity(
          edge.from,
          edge.to
        );


      const edgeColor =
        highlighted
          ? "#facc15"
          : "#8b5cf6";


      visualEdges.push({

        id:
          `original-${index}`,

        source:
          edge.from,

        target:
          edge.to,

        // KEEP EDGES STRAIGHT
        type: "straight",

        label:
          currentStepData
            ? `${remaining}/${edge.capacity}`
            : String(edge.capacity),

        markerEnd: {

          type:
            MarkerType.ArrowClosed,

          color:
            edgeColor,

        },

        style: {

          stroke:
            edgeColor,

          strokeWidth:
            highlighted
              ? 4
              : 2.2,

        },

        labelStyle: {

          fill:
            edgeColor,

          fontSize: 12,

          fontWeight: 800,

        },

        labelBgStyle: {

          fill:
            "#11131c",

          fillOpacity:
            0.96,

        },

        labelBgPadding: [
          6,
          3,
        ],

        labelBgBorderRadius:
          5,

        animated:
          highlighted,

      });

    });


    // =======================================
    // RESIDUAL EDGES
    // =======================================

    if (currentStepData) {

      currentStepData.residualGraph.forEach(
        (residual, index) => {

          if (residual.capacity <= 0) {
            return;
          }


          // Don't draw duplicate original edge
          if (
            isOriginalEdge(
              residual.from,
              residual.to
            )
          ) {
            return;
          }


          visualEdges.push({

            id:
              `residual-${index}`,

            source:
              residual.from,

            target:
              residual.to,

            type:
              "straight",

            label:
              `↩ ${residual.capacity}`,

            markerEnd: {

              type:
                MarkerType.ArrowClosed,

              color:
                "#38bdf8",

            },

            style: {

              stroke:
                "#38bdf8",

              strokeWidth:
                2,

              strokeDasharray:
                "6 5",

            },

            labelStyle: {

              fill:
                "#38bdf8",

              fontSize: 11,

              fontWeight: 800,

            },

            labelBgStyle: {

              fill:
                "#11131c",

              fillOpacity:
                0.96,

            },

            labelBgPadding: [
              5,
              3,
            ],

            labelBgBorderRadius:
              5,

          });

        }
      );

    }


    return visualEdges;

  }, [
    edges,
    currentStepData,
    currentPath,
  ]);


  // =========================================
  // GRAPH UI
  // =========================================

  return (

    <div
      className="visualization-card"
      style={{
        position: "relative",
      }}
    >

      {/* =====================================
          GRAPH STATUS
          ===================================== */}

      <div
        style={{
          position: "absolute",

          zIndex: 10,

          top: "16px",

          left: "18px",

          padding: "8px 12px",

          borderRadius: "8px",

          background:
            "rgba(16, 19, 29, 0.92)",

          border:
            "1px solid rgba(139, 92, 246, 0.30)",

          color: "#aeb4c7",

          fontSize: "11px",

          fontWeight: "700",

          letterSpacing: "0.5px",

          backdropFilter:
            "blur(10px)",

          pointerEvents:
            "none",

        }}
      >

        {currentStepData
          ? `BFS STEP ${currentStep + 1}`
          : "NETWORK READY"}

      </div>


      {/* =====================================
          GRAPH
          ===================================== */}

      <div className="flow-area">

        <ReactFlow

          nodes={flowNodes}

          edges={flowEdges}

          fitView

          fitViewOptions={{
            padding: 0.22,
          }}

          minZoom={0.5}

          maxZoom={1.5}

          nodesDraggable={false}

          nodesConnectable={false}

          elementsSelectable={false}

          proOptions={{
            hideAttribution: true,
          }}

        >

          <Background
            color="#30354a"
            gap={28}
            size={1}
          />

          <Controls
            showInteractive={false}
          />

        </ReactFlow>

      </div>

    </div>

  );

}

export default GraphVisualization;