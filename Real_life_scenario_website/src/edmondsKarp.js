export function edmondsKarp(nodes, edges, sourceId, sinkId) {
  if (!sourceId || !sinkId || sourceId === sinkId) throw new Error("Choose two different locations.");
  const ids = new Set(nodes.map(n => n.id));
  if (!ids.has(sourceId) || !ids.has(sinkId)) throw new Error("A selected location no longer exists.");
  const residual = new Map(nodes.map(n => [n.id, new Map()]));
  for (const e of edges) {
    const cap = Number(e.data?.capacity);
    if (!ids.has(e.source) || !ids.has(e.target) || !Number.isFinite(cap) || cap < 0) throw new Error("Invalid route or capacity.");
    if (residual.get(e.source).has(e.target) && residual.get(e.source).get(e.target) > 0) throw new Error("Parallel directed routes are not supported.");
    residual.get(e.source).set(e.target, cap);
    if (!residual.get(e.target).has(e.source)) residual.get(e.target).set(e.source, 0);
  }
  let maxFlow = 0; const steps = [];
  const bfs = () => {
    const parent = new Map(), queue = [sourceId], seen = new Set([sourceId]);
    while (queue.length) {
      const u = queue.shift();
      for (const [v, cap] of residual.get(u)) if (cap > 0 && !seen.has(v)) {
        seen.add(v); parent.set(v,u); if (v === sinkId) return parent; queue.push(v);
      }
    }
    return null;
  };
  while (true) {
    const parent = bfs(); if (!parent) break;
    let flow = Infinity, v = sinkId, path = [sinkId];
    while (v !== sourceId) { const u = parent.get(v); flow = Math.min(flow,residual.get(u).get(v)); v=u; path.unshift(v); }
    v=sinkId;
    while (v !== sourceId) { const u=parent.get(v); residual.get(u).set(v,residual.get(u).get(v)-flow); residual.get(v).set(u,residual.get(v).get(u)+flow); v=u; }
    maxFlow += flow;
    steps.push({path,flow,totalFlow:maxFlow,residualCapacities:edges.map(e=>{const cap=Number(e.data.capacity),r=residual.get(e.source)?.get(e.target)??0;return{id:e.id,source:e.source,target:e.target,capacity:cap,residual:r,flow:cap-r};})});
  }
  const bottlenecks=edges.filter(e=>Number(e.data.capacity)>0&&residual.get(e.source)?.get(e.target)===0).map(e=>({id:e.id,source:e.source,target:e.target,capacity:Number(e.data.capacity)}));
  return {maxFlow,steps,sourceId,sinkId,bottlenecks};
}
