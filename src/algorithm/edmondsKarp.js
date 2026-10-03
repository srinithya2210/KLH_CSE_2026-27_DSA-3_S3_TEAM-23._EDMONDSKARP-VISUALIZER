function edmondsKarp(nodes, edges, source, sink) {
  const graph = {};
  const residualGraph = {};

  // Create graph and residual graph
  for (const node of nodes) {
    graph[node] = {};
    residualGraph[node] = {};
  }

  // Store original capacities
  for (const edge of edges) {
    const { from, to, capacity } = edge;

    graph[from][to] = capacity;

    if (residualGraph[from][to] === undefined) {
      residualGraph[from][to] = 0;
    }

    if (residualGraph[to][from] === undefined) {
      residualGraph[to][from] = 0;
    }

    residualGraph[from][to] += capacity;
  }

  let maxFlow = 0;
  const steps = [];

  // BFS function
  function bfs() {
    const parent = {};
    const visited = {};
    const queue = [];

    for (const node of nodes) {
      visited[node] = false;
      parent[node] = null;
    }

    queue.push(source);
    visited[source] = true;

    while (queue.length > 0) {
      const current = queue.shift();

      for (const next of nodes) {
        if (
          !visited[next] &&
          residualGraph[current] &&
          residualGraph[current][next] !== undefined &&
          residualGraph[current][next] > 0
        ) {
          parent[next] = current;
          visited[next] = true;
          queue.push(next);

          if (next === sink) {
            return parent;
          }
        }
      }
    }

    return null;
  }

  // Edmonds-Karp
  while (true) {
    const parent = bfs();

    if (parent === null || !parent[sink]) {
      break;
    }

    // Find augmenting path
    const path = [];
    let current = sink;

    while (current !== null) {
      path.push(current);
      current = parent[current];
    }

    path.reverse();

    // Find bottleneck
    let bottleneck = Infinity;

    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];

      bottleneck = Math.min(
        bottleneck,
        residualGraph[from][to]
      );
    }

    // Update residual graph
    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];

      residualGraph[from][to] -= bottleneck;

      if (residualGraph[to][from] === undefined) {
        residualGraph[to][from] = 0;
      }

      residualGraph[to][from] += bottleneck;
    }

    // Add flow
    const flowAdded = bottleneck;
    maxFlow += flowAdded;

    // Convert residual graph into array format
    const residualGraphArray = [];

    for (const from of nodes) {
      if (residualGraph[from]) {
        for (const to of nodes) {
          if (
            residualGraph[from][to] !== undefined
          ) {
            residualGraphArray.push({
              from: from,
              to: to,
              capacity: residualGraph[from][to]
            });
          }
        }
      }
    }

    // Store this iteration
    steps.push({
      iteration: steps.length + 1,
      path: path,
      bottleneck: bottleneck,
      flowAdded: flowAdded,
      maxFlow: maxFlow,
      residualGraph: residualGraphArray
    });
  }

  return {
    source: source,
    sink: sink,
    maxFlow: maxFlow,
    steps: steps
  };
}

export { edmondsKarp };