import React, { useState } from "react";

export default function DijkstraInteractive() {
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
    edges.forEach((e) => adj[e.from].push({ to: e.to, w: e.w }));

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
    setPath(p);
  };

  return (
    <div className="p-15 bg-gray-800 rounded-2xl h-[700px]">
      <h1 className="text-4xl font-bold mb-15 text-white">
        Dijkstra Interactive
      </h1>

      {/* Nodes */}
      <div className="mb-4">
        <input
          value={nodeInput}
          onChange={(e) => setNodeInput(e.target.value)}
          placeholder="Node label"
          className="border border-white text-white p-1 mr-2"
        />
        <button
          onClick={addNode}
          className="bg-green-600 text-white px-2 rounded"
        >
          Add Node
        </button>
        <div className="mt-2  text-white">Nodes: {nodes.join(", ")}</div>
      </div>

      {/* Edges */}
      <div className="mb-4">
        <select
          value={edgeFrom}
          onChange={(e) => setEdgeFrom(e.target.value)}
          className="border p-1 mr-2 border-white  text-white"
        >
          <option value="">From</option>
          {nodes.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
        <select
          value={edgeTo}
          onChange={(e) => setEdgeTo(e.target.value)}
          className="border p-1 mr-2 border-white  text-white"
        >
          <option value="">To</option>
          {nodes.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
        <input
          type="number"
          value={edgeWeight}
          onChange={(e) => setEdgeWeight(e.target.value)}
          className="border p-1 mr-2 w-20 border-white  text-white"
        />
        <button
          onClick={addEdge}
          className="bg-blue-600 text-white px-2 rounded"
        >
          Add Edge
        </button>
        <div className="mt-2 text-white">
          Edges: {edges.map((e) => `${e.from}→${e.to}(${e.w})`).join(", ")}
        </div>
      </div>

      {/* Run */}
      <div className="mb-4 flex gap-2">
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="border p-1 border-white  text-white"
        >
          <option value="">Source</option>
          {nodes.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
        <select
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="border p-1 border-white  text-white"
        >
          <option value="">Target</option>
          {nodes.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
        <button
          onClick={runDijkstra}
          className="bg-purple-600 text-white px-2 rounded"
        >
          Run
        </button>
      </div>

      {/* Results */}
      <div>
        <h2 className="font-semibold text-white">Distances:</h2>
        <ul className="text-white">
          {nodes.map((n) => (
            <li key={n}>
              {n}: {dist[n] === Infinity ? "∞" : dist[n]}
            </li>
          ))}
        </ul>
        <h2 className="font-semibold mt-2 text-white">Shortest Path:</h2>
        <div className="text-white">
          {path.length ? path.join(" → ") : "No path"}
        </div>
      </div>
    </div>
  );
}
