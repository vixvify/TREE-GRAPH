import React, { useState } from "react";
import { useEffect } from "react";

export default function GraphTraversal({ onGraphChange, onHighlight }) {
  const [edges, setEdges] = useState("");
  const [startNode, setStartNode] = useState("");
  const [dfsResult, setDfsResult] = useState([]);
  const [bfsResult, setBfsResult] = useState([]);

  const buildGraph = (edges) => {
    const graph = {};
    const pairs = edges
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e.includes("-"));
    for (let pair of pairs) {
      const [a, b] = pair.split("-").map((v) => v.trim());
      if (!graph[a]) graph[a] = [];
      if (!graph[b]) graph[b] = [];
      graph[a].push(b);
      graph[b].push(a);
    }
    return graph;
  };

  const dfs = (graph, start) => {
    const visited = new Set();
    const result = [];
    const traverse = (node) => {
      if (!node || visited.has(node)) return;
      visited.add(node);
      result.push(node);
      for (let neighbor of graph[node] || []) traverse(neighbor);
    };
    traverse(start);
    return result;
  };

  const bfs = (graph, start) => {
    const visited = new Set();
    const queue = [start];
    const result = [];
    while (queue.length > 0) {
      const node = queue.shift();
      if (!visited.has(node)) {
        visited.add(node);
        result.push(node);
        for (let neighbor of graph[node] || [])
          if (!visited.has(neighbor)) queue.push(neighbor);
      }
    }
    return result;
  };

  useEffect(() => {
    const graph = buildGraph(edges);
    const nodes = Object.keys(graph);
    const edgeList = [];

    Object.keys(graph).forEach((u) =>
      graph[u].forEach((v) => {
        if (!edgeList.find((e) => e.from === v && e.to === u)) {
          edgeList.push({ from: u, to: v, w: 1 });
        }
      })
    );

    onGraphChange(nodes, edgeList);
  }, [edges]);

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
        DFS & BFS
      </h1>

      <label className="block text-sm text-purple-200 mb-1">
        🧩 ใส่เส้นเชื่อม (A-B, A-C, B-D)
      </label>
      <input
        value={edges}
        onChange={(e) => setEdges(e.target.value)}
        placeholder="A-B, A-C, B-D"
        className="w-full p-2 rounded bg-black/40 border border-purple-500/40 
        text-purple-100 focus:outline-none focus:border-purple-300 mb-4"
      />

      <label className="block text-sm text-purple-200 mb-1">
        🚀 Node เริ่มต้น:
      </label>
      <input
        value={startNode}
        onChange={(e) => setStartNode(e.target.value)}
        placeholder="A"
        className="w-full p-2 rounded bg-black/40 border border-purple-500/40 
        text-purple-100 focus:outline-none focus:border-purple-300 mb-4"
      />

      <div className="flex gap-3 justify-center mb-6">
        <button
          onClick={() => setDfsResult(dfs(buildGraph(edges), startNode))}
          className="px-4 py-2 rounded bg-gradient-to-r from-purple-700 to-purple-500 
          hover:opacity-90 shadow-md shadow-purple-800/40"
        >
          Run DFS
        </button>
        <button
          onClick={() => setBfsResult(bfs(buildGraph(edges), startNode))}
          className="px-4 py-2 rounded bg-gradient-to-r from-purple-700 to-purple-500 
          hover:opacity-90 shadow-md shadow-purple-800/40"
        >
          Run BFS
        </button>
      </div>

      <p className="text-purple-300 font-semibold">DFS Order:</p>
      <p className="text-gray-300 mb-3">
        {dfsResult.length > 0 ? dfsResult.join(" → ") : "-"}
      </p>

      <p className="text-green-300 font-semibold">BFS Order:</p>
      <p className="text-gray-300">
        {bfsResult.length > 0 ? bfsResult.join(" → ") : "-"}
      </p>
    </div>
  );
}
