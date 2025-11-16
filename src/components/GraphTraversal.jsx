import React, { useState } from "react";

export default function GraphTraversal() {
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
      for (let neighbor of graph[node] || []) {
        traverse(neighbor);
      }
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
        for (let neighbor of graph[node] || []) {
          if (!visited.has(neighbor)) queue.push(neighbor);
        }
      }
    }
    return result;
  };

  const handleDFS = () => {
    const graph = buildGraph(edges);
    const res = dfs(graph, startNode);
    setDfsResult(res);
  };

  const handleBFS = () => {
    const graph = buildGraph(edges);
    const res = bfs(graph, startNode);
    setBfsResult(res);
  };

  return (
    <div className="flex flex-col items-center justify-center text-white">
      <div className="bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col gap-5 h-[800px]">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Graph Traversal (DFS & BFS)
        </h1>

        <label className="block mb-2 text-sm font-semibold">
          🧩 ใส่เส้นเชื่อมระหว่าง Node (เช่น A-B, A-C, B-D):
        </label>
        <input
          type="text"
          placeholder="A-B, A-C, B-D"
          value={edges}
          onChange={(e) => setEdges(e.target.value)}
          className="w-full mb-4 p-2 rounded-lg text-white border-2 border-white"
        />

        <label className="block mb-2 text-sm font-semibold">
          🚀 Node เริ่มต้น:
        </label>
        <input
          type="text"
          placeholder="A"
          value={startNode}
          onChange={(e) => setStartNode(e.target.value)}
          className="w-full mb-4 p-2 rounded-lg text-white border-2 border-white"
        />

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleDFS}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Run DFS
          </button>
          <button
            onClick={handleBFS}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
          >
            Run BFS
          </button>
        </div>

        <div className="mt-6">
          <p className="text-lg font-semibold text-blue-400">DFS Order:</p>
          <p className="text-gray-300 mb-3">
            {dfsResult.length > 0 ? dfsResult.join(" → ") : "-"}
          </p>

          <p className="text-lg font-semibold text-green-400">BFS Order:</p>
          <p className="text-gray-300">
            {bfsResult.length > 0 ? bfsResult.join(" → ") : "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
