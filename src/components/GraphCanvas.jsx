import React, { useEffect, useState } from "react";
import { ReactFlow, Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";

export default function GraphCanvas({ nodesData, edgesData, highlightEdges }) {
  const [flowNodes, setFlowNodes] = useState([]);
  const [flowEdges, setFlowEdges] = useState([]);

  useEffect(() => {
    const formattedNodes = nodesData.map((n, i) => ({
      id: n,
      position: { x: (i % 5) * 150, y: Math.floor(i / 5) * 120 },
      data: { label: n },
      style: {
        background: "#2A2A3A",
        color: "#E9D5FF",
        border: "2px solid #A855F7",
        borderRadius: 10,
        padding: 10,
        width: 50,
        textAlign: "center",
      },
    }));

    const formattedEdges = edgesData.map((e, i) => {
      const isHighlight = highlightEdges?.some(
        (h) =>
          (h.from === e.from && h.to === e.to) ||
          (h.from === e.to && h.to === e.from)
      );

      return {
        id: "e" + i,
        source: e.from,
        target: e.to,
        label: String(e.w),
        animated: isHighlight,
        style: {
          stroke: isHighlight ? "#F0ABFC" : "#A855F7",
          strokeWidth: isHighlight ? 4 : 2,
        },
        labelStyle: {
          fill: isHighlight ? "#F9A8FF" : "#C084FC",
          fontWeight: "bold",
          fontSize: isHighlight ? 14 : 12,
        },
      };
    });

    setFlowNodes(formattedNodes);
    setFlowEdges(formattedEdges);
  }, [nodesData, edgesData, highlightEdges]);

  return (
    <div
      className="
        bg-[#1A1A26] border border-purple-500/40 
        shadow-lg shadow-purple-600/25 
        rounded-2xl p-4 w-[450px] h-[700px]
        backdrop-blur-sm 
      "
    >
      <h1
        className="text-3xl font-bold text-center mb-3 
        bg-gradient-to-r from-purple-300 to-purple-500 text-transparent bg-clip-text"
      >
        Graph Visualizer
      </h1>

      <div className="w-full h-[630px] rounded-xl overflow-hidden">
        <ReactFlow nodes={flowNodes} edges={flowEdges} fitView>
          <Background color="#6B21A8" gap={20} />
          <Controls />
          <MiniMap nodeColor={() => "#6D28D9"} nodeStrokeWidth={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
