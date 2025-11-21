import React, { useState } from "react";
import { useEffect } from "react";

export default function DijkstraVisualizer({ onGraphChange, onHighlight }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodeInput, setNodeInput] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("");
  const [edgeTo, setEdgeTo] = useState("");
  const [edgeWeight, setEdgeWeight] = useState(1);
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [dist, setDist] = useState({});
  const [path, setPath] = useState([]);

  const addNode = () => {
    if (nodeInput && !nodes.includes(nodeInput)) {
      setNodes([...nodes, nodeInput]);
      setNodeInput("");
    }
  };

  const addEdge = () => {
    if (edgeFrom && edgeTo && edgeWeight >= 0) {
      setEdges([
        ...edges,
        { from: edgeFrom, to: edgeTo, w: Number(edgeWeight) },
      ]);
    }
  };

  const runDijkstra = () => {
    const adj = {};
    nodes.forEach((n) => (adj[n] = []));
    edges.forEach((e) => {
      adj[e.from].push({ to: e.to, w: e.w });
      adj[e.to].push({ to: e.from, w: e.w });
    });

    const d = {},
      prev = {};
    nodes.forEach((n) => {
      d[n] = Infinity;
      prev[n] = null;
    });
    d[source] = 0;

    const visited = new Set();
    while (true) {
      let u = null,
        best = Infinity;
      nodes.forEach(
        (n) => !visited.has(n) && d[n] < best && ((best = d[n]), (u = n))
      );
      if (!u) break;

      visited.add(u);

      adj[u].forEach(({ to, w }) => {
        const alt = d[u] + w;
        if (alt < d[to]) {
          d[to] = alt;
          prev[to] = u;
        }
      });
    }

    setDist(d);

    const p = [];
    let cur = target;
    while (cur) {
      p.push(cur);
      cur = prev[cur];
    }
    p.reverse();
    if (d[target] === Infinity) p.length = 0;
    onHighlight(
      p.slice(0, -1).map((node, i) => ({ from: node, to: p[i + 1] }))
    );

    setPath(p);
  };

  useEffect(() => {
    onGraphChange(nodes, edges);
  }, [nodes, edges]);

  return (
    <div
      className="
      bg-[#1A1A26] border border-purple-500/40 
      shadow-lg shadow-purple-600/25 
      rounded-2xl p-8 w-[380px] h-[700px]
      backdrop-blur-sm transition-all duration-300
      hover:shadow-purple-500/60 hover:scale-[1.02]
    "
    >
      <h1
        className="text-3xl font-bold text-center mb-6 
      bg-gradient-to-r from-purple-300 to-purple-500 text-transparent bg-clip-text"
      >
        Dijkstra Algorithm
      </h1>

      {/* Node Input */}
      <div className="mb-4">
        <input
          value={nodeInput}
          onChange={(e) => setNodeInput(e.target.value)}
          placeholder="Node label"
          className="w-full p-2 rounded bg-black/40 border border-purple-500/40 
          text-purple-100 focus:outline-none focus:border-purple-300"
        />
        <button
          onClick={addNode}
          className="mt-2 w-full px-4 py-2 rounded bg-gradient-to-r from-purple-700 to-purple-500 
          hover:opacity-90 shadow-md shadow-purple-800/40"
        >
          Add Node
        </button>
        <div className="mt-2 text-purple-300 text-sm">
          Nodes: {nodes.join(", ")}
        </div>
      </div>

      {/* Edge Input */}
      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <select
            value={edgeFrom}
            onChange={(e) => setEdgeFrom(e.target.value)}
            className="w-full p-2 bg-black/40 border border-purple-500/40 text-purple-100 rounded"
          >
            <option value="">From</option>
            {nodes.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>

          <select
            value={edgeTo}
            onChange={(e) => setEdgeTo(e.target.value)}
            className="w-full p-2 bg-black/40 border border-purple-500/40 text-purple-100 rounded"
          >
            <option value="">To</option>
            {nodes.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>

        <input
          type="number"
          value={edgeWeight}
          onChange={(e) => setEdgeWeight(e.target.value)}
          className="w-full p-2 bg-black/40 border border-purple-500/40 text-purple-100 rounded mb-2"
        />

        <button
          onClick={addEdge}
          className="w-full px-4 py-2 rounded bg-gradient-to-r from-purple-700 to-purple-500 
          hover:opacity-90 shadow-md shadow-purple-800/40"
        >
          Add Edge
        </button>

        <div className="mt-2 text-purple-300 text-sm">
          Edges: {edges.map((e) => `${e.from}→${e.to}(${e.w})`).join(", ")}
        </div>
      </div>

      {/* RUN */}
      <div className="flex gap-2 mb-4">
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full p-2 bg-black/40 border border-purple-500/40 text-purple-100 rounded"
        >
          <option value="">Source</option>
          {nodes.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>

        <select
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full p-2 bg-black/40 border border-purple-500/40 text-purple-100 rounded"
        >
          <option value="">Target</option>
          {nodes.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </div>

      <button
        onClick={runDijkstra}
        className="w-full px-4 py-2 rounded bg-gradient-to-r from-purple-700 to-purple-500 
        hover:opacity-90 shadow-md shadow-purple-800/40"
      >
        Run
      </button>

      {/* Results */}
      <div className="mt-4 text-sm text-purple-200">
        <h2 className="font-semibold text-purple-300">Distances:</h2>
        {nodes.map((n) => (
          <div key={n}>
            {n}: {dist[n] === Infinity ? "∞" : dist[n]}
          </div>
        ))}

        <h2 className="font-semibold mt-3 text-purple-300">Shortest Path:</h2>
        {path.length ? path.join(" → ") : "No path"}
      </div>
    </div>
  );
}
