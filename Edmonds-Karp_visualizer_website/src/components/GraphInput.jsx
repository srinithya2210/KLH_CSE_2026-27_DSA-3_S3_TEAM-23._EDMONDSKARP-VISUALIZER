import { useState } from "react";
import "./GraphInput.css";

function GraphInput({
  nodes,
  setNodes,
  edges,
  setEdges,
  source,
  setSource,
  destination,
  setDestination,
}) {

  const [nodeInput, setNodeInput] = useState("");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [capacity, setCapacity] = useState("");


  // =========================================
  // ENTER KEY
  // =========================================

  const handleKeyDown = (event, action) => {

    if (event.key === "Enter") {
      event.preventDefault();
      action();
    }

  };


  // =========================================
  // ADD NODE
  // =========================================

  const addNode = () => {

    const node = nodeInput.trim();

    if (!node) {
      return;
    }

    if (nodes.includes(node)) {
      return;
    }

    setNodes([...nodes, node]);

    setNodeInput("");

  };


  // =========================================
  // ADD EDGE
  // =========================================

  const addEdge = () => {

    if (!from || !to || !capacity) {
      return;
    }

    if (!nodes.includes(from) || !nodes.includes(to)) {

      alert(
        "Please add both nodes before creating an edge."
      );

      return;
    }

    if (from === to) {

      alert(
        "An edge must connect two different nodes."
      );

      return;
    }

    if (Number(capacity) <= 0) {

      alert(
        "Capacity must be greater than 0."
      );

      return;
    }


    const newEdge = {
      from: from.trim(),
      to: to.trim(),
      capacity: Number(capacity),
    };


    setEdges([
      ...edges,
      newEdge,
    ]);


    setFrom("");
    setTo("");
    setCapacity("");

  };


  return (

    <div className="graph-input">


      {/* ===================================
          NODE SECTION
      ==================================== */}

      <div className="input-section">

        <div className="input-heading">

          <span className="input-number">
            01
          </span>

          <div>

            <label>
              Add Node
            </label>

            <small>
              Create a vertex in the network
            </small>

          </div>

        </div>


        <div className="input-row">

          <input
            type="text"
            placeholder="A"
            value={nodeInput}
            onChange={(e) =>
              setNodeInput(e.target.value)
            }
            onKeyDown={(e) =>
              handleKeyDown(e, addNode)
            }
          />

          <button
            className="add-button"
            onClick={addNode}
          >
            +
          </button>

        </div>


        <div className="node-list">

          {nodes.length === 0 ? (

            <span className="empty-text">
              No nodes created
            </span>

          ) : (

            nodes.map((node) => (

              <span
                className="node-chip"
                key={node}
              >
                {node}
              </span>

            ))

          )}

        </div>

      </div>


      {/* ===================================
          EDGE SECTION
      ==================================== */}

      <div className="input-section">

        <div className="input-heading">

          <span className="input-number">
            02
          </span>

          <div>

            <label>
              Add Directed Edge
            </label>

            <small>
              Define direction and capacity
            </small>

          </div>

        </div>


        <div className="edge-input-grid">

          <input
            type="text"
            placeholder="From"
            value={from}
            onChange={(e) =>
              setFrom(e.target.value)
            }
            onKeyDown={(e) =>
              handleKeyDown(e, addEdge)
            }
          />


          <span className="arrow">
            →
          </span>


          <input
            type="text"
            placeholder="To"
            value={to}
            onChange={(e) =>
              setTo(e.target.value)
            }
            onKeyDown={(e) =>
              handleKeyDown(e, addEdge)
            }
          />

        </div>


        <div className="capacity-row">

          <input
            type="number"
            min="1"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) =>
              setCapacity(e.target.value)
            }
            onKeyDown={(e) =>
              handleKeyDown(e, addEdge)
            }
          />


          <button
            className="add-edge-button"
            onClick={addEdge}
          >
            Add Edge
          </button>

        </div>


        {/* EDGE LIST */}

        <div className="edge-list">

          {edges.length === 0 ? (

            <div className="empty-text">
              No edges created
            </div>

          ) : (

            edges.map((edge, index) => (

              <div
                className="edge-item"
                key={index}
              >

                <span className="edge-from">
                  {edge.from}
                </span>

                <span className="edge-arrow">
                  →
                </span>

                <span className="edge-to">
                  {edge.to}
                </span>

                <span className="edge-capacity">
                  {edge.capacity}
                </span>

              </div>

            ))

          )}

        </div>

      </div>


      {/* ===================================
          SOURCE / DESTINATION
      ==================================== */}

      <div className="input-section">

        <div className="input-heading">

          <span className="input-number">
            03
          </span>

          <div>

            <label>
              Flow Endpoints
            </label>

            <small>
              Select source and destination
            </small>

          </div>

        </div>


        <div className="endpoint-grid">

          <div>

            <span className="endpoint-label source-label">
              SOURCE
            </span>

            <select
              value={source}
              onChange={(e) =>
                setSource(e.target.value)
              }
            >

              <option value="">
                Select
              </option>

              {nodes.map((node) => (

                <option
                  key={node}
                  value={node}
                >
                  {node}
                </option>

              ))}

            </select>

          </div>


          <div>

            <span className="endpoint-label destination-label">
              DESTINATION
            </span>

            <select
              value={destination}
              onChange={(e) =>
                setDestination(e.target.value)
              }
            >

              <option value="">
                Select
              </option>

              {nodes.map((node) => (

                <option
                  key={node}
                  value={node}
                >
                  {node}
                </option>

              ))}

            </select>

          </div>

        </div>

      </div>


    </div>

  );
}

export default GraphInput;