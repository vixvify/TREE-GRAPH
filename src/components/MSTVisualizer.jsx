import React, { useState } from "react";

export default function MSTVisualizer() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodeInput, setNodeInput] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("");
  const [edgeTo, setEdgeTo] = useState("");
  const [edgeWeight, setEdgeWeight] = useState(1);
  const [primMST, setPrimMST] = useState([]);
  const [kruskalMST, setKruskalMST] = useState([]);

  // เพิ่ม Node
  const addNode = () => {
    if (nodeInput && !nodes.includes(nodeInput)) {
      setNodes([...nodes, nodeInput]);
      setNodeInput("");
    }
  };

  // เพิ่ม Edge
  const addEdge = () => {
    if (edgeFrom && edgeTo && edgeWeight >= 0) {
      setEdges([
        ...edges,
        { from: edgeFrom, to: edgeTo, w: Number(edgeWeight) },
      ]);
    }
  };

  // --- Prim's Algorithm ---
  const runPrim = () => {
    if (nodes.length === 0) return;
    const visited = new Set();
    const mst = [];
    const adj = {};
    nodes.forEach((n) => (adj[n] = []));
    edges.forEach((e) => {
      adj[e.from].push({ to: e.to, w: e.w });
      adj[e.to].push({ to: e.from, w: e.w }); // undirected
    });
    const start = nodes[0];
    visited.add(start);
    while (visited.size < nodes.length) {
      let minEdge = null;
      visited.forEach((u) => {
        adj[u].forEach(({ to, w }) => {
          if (!visited.has(to) && (!minEdge || w < minEdge.w))
            minEdge = { from: u, to, w };
        });
      });
      if (minEdge) {
        mst.push(minEdge);
        visited.add(minEdge.to);
      } else break;
    }
    setPrimMST(mst);
  };

  // --- Kruskal's Algorithm ---
  const runKruskal = () => {
    const parent = {};
    nodes.forEach((n) => (parent[n] = n));
    const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
    const union = (x, y) => {
      parent[find(x)] = find(y);
    };
    const sorted = [...edges].sort((a, b) => a.w - b.w);
    const mst = [];
    for (const e of sorted) {
      if (find(e.from) !== find(e.to)) {
        mst.push(e);
        union(e.from, e.to);
      }
    }
    setKruskalMST(mst);
  };

  return (
    <div className="p-10 bg-gray-800 rounded-2xl h-[700px]">
      <h1 className="text-4xl font-bold text-white mb-15">
        Minimum Spanning Tree (MST)
      </h1>

      {/* Nodes */}
      <div className="mb-4">
        <input
          value={nodeInput}
          onChange={(e) => setNodeInput(e.target.value)}
          placeholder="Node label"
          className="border p-1 mr-2 text-white border-white"
        />
        <button
          onClick={addNode}
          className="bg-green-600 text-white px-2 rounded"
        >
          Add Node
        </button>
        <div className="mt-2 text-white">Nodes: {nodes.join(", ")}</div>
      </div>

      {/* Edges */}
      <div className="mb-4">
        <select
          value={edgeFrom}
          onChange={(e) => setEdgeFrom(e.target.value)}
          className="border p-1 mr-2 text-white border-white"
        >
          <option value="">From</option>
          {nodes.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
        <select
          value={edgeTo}
          onChange={(e) => setEdgeTo(e.target.value)}
          className="border p-1 mr-2 text-white border-white"
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
          className="border p-1 mr-2 w-20 text-white"
        />
        <button
          onClick={addEdge}
          className="bg-blue-600 text-white px-2 rounded"
        >
          Add Edge
        </button>
        <div className="mt-2 text-white">
          Edges: {edges.map((e) => `${e.from}↔${e.to}(${e.w})`).join(", ")}
        </div>
      </div>

      {/* Run MST */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={runPrim}
          className="bg-purple-600 text-white px-3 rounded"
        >
          Run Prim
        </button>
        <button
          onClick={runKruskal}
          className="bg-orange-600 text-white px-3 rounded"
        >
          Run Kruskal
        </button>
      </div>

      {/* Results */}
      <div>
        <h2 className="font-semibold mt-2 text-white">Prim's MST:</h2>
        <div className="text-white">
          {primMST.length
            ? primMST.map((e) => `${e.from}↔${e.to}(${e.w})`).join(", ")
            : "No MST yet"}
        </div>

        <h2 className="font-semibold mt-2 text-white">Kruskal's MST:</h2>
        <div className="text-white">
          {kruskalMST.length
            ? kruskalMST.map((e) => `${e.from}↔${e.to}(${e.w})`).join(", ")
            : "No MST yet"}
        </div>
      </div>
    </div>
  );
}
