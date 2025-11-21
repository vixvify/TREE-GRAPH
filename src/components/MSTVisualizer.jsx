import React, { useState } from "react";
import { useEffect } from "react";

export default function MSTVisualizer({ onGraphChange, onHighlight }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodeInput, setNodeInput] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("");
  const [edgeTo, setEdgeTo] = useState("");
  const [edgeWeight, setEdgeWeight] = useState(1);
  const [primMST, setPrimMST] = useState([]);
  const [kruskalMST, setKruskalMST] = useState([]);

  const addNode = () => {
    if (nodeInput && !nodes.includes(nodeInput)) {
      setNodes([...nodes, nodeInput]);
      setNodeInput("");
    }
  };

  const addEdge = () => {
    if (edgeFrom && edgeTo && edgeWeight >= 0) {
      const w = Number(edgeWeight);
      const u = edgeFrom < edgeTo ? edgeFrom : edgeTo;
      const v = edgeFrom < edgeTo ? edgeTo : edgeFrom;

      setEdges([...edges, { from: u, to: v, w }]);
    }
  };

  const runPrim = () => {
    if (nodes.length === 0) return;

    const visited = new Set();
    const mst = [];
    const adj = {};

    nodes.forEach((n) => (adj[n] = []));
    edges.forEach((e) => {
      adj[e.from].push({ to: e.to, w: e.w });
      adj[e.to].push({ to: e.from, w: e.w });
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

      if (!minEdge) break;

      mst.push(minEdge);
      visited.add(minEdge.to);
    }
    onHighlight(mst);
    setPrimMST(mst);
  };

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
    onHighlight(mst);
    setKruskalMST(mst);
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
        Minimum Spanning Tree
      </h1>

      {/* Input Node */}
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
          className="mt-2 w-full px-4 py-2 rounded bg-gradient-to-r 
          from-purple-700 to-purple-500 hover:opacity-90 
          shadow-md shadow-purple-800/40"
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
            className="w-full p-2 bg-black/40 border border-purple-500/40 
            text-purple-100 rounded"
          >
            <option value="">From</option>
            {nodes.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>

          <select
            value={edgeTo}
            onChange={(e) => setEdgeTo(e.target.value)}
            className="w-full p-2 bg-black/40 border border-purple-500/40 
            text-purple-100 rounded"
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
          className="w-full p-2 bg-black/40 border border-purple-500/40 
          text-purple-100 rounded mb-2"
        />

        <button
          onClick={addEdge}
          className="w-full px-4 py-2 rounded bg-gradient-to-r 
          from-purple-700 to-purple-500 hover:opacity-90 shadow-md shadow-purple-800/40"
        >
          Add Edge
        </button>

        <div className="mt-2 text-purple-300 text-sm">
          Edges: {edges.map((e) => `${e.from}↔${e.to}(${e.w})`).join(", ")}
        </div>
      </div>

      {/* RUN */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={runPrim}
          className="w-full px-4 py-2 rounded bg-gradient-to-r 
          from-purple-700 to-purple-500 hover:opacity-90 shadow-md shadow-purple-800/40"
        >
          Run Prim
        </button>

        <button
          onClick={runKruskal}
          className="w-full px-4 py-2 rounded bg-gradient-to-r 
          from-purple-700 to-purple-500 hover:opacity-90 shadow-md shadow-purple-800/40"
        >
          Run Kruskal
        </button>
      </div>

      {/* Results */}
      <div className="text-sm text-purple-200">
        <h2 className="font-semibold text-purple-300 mb-1">Prim's MST:</h2>
        {primMST.length
          ? primMST.map((e) => `${e.from}↔${e.to}(${e.w})`).join(", ")
          : "No MST yet"}

        <h2 className="font-semibold text-purple-300 mt-3 mb-1">
          Kruskal's MST:
        </h2>
        {kruskalMST.length
          ? kruskalMST.map((e) => `${e.from}↔${e.to}(${e.w})`).join(", ")
          : "No MST yet"}
      </div>
    </div>
  );
}
