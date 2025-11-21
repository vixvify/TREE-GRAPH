import React, { useState } from "react";
import GraphTraversal from "./components/GraphTraversal";
import DijkstraVisualizer from "./components/DijkstraVisualizer";
import MSTVisualizer from "./components/MSTVisualizer";
import GraphCanvas from "./components/GraphCanvas";

export default function App() {
  const [allNodes, setAllNodes] = useState([]);
  const [allEdges, setAllEdges] = useState([]);
  const [highlightEdges, setHighlightEdges] = useState([]);

  const handleGraphUpdate = (nodes, edges) => {
    setAllNodes(nodes);
    setAllEdges(edges);
  };

  const handleHighlight = (edges) => setHighlightEdges(edges);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0A0A0F] text-white">
      <div className="flex flex-col lg:flex-row justify-center items-start gap-10 px-10">
        <GraphTraversal
          onGraphChange={handleGraphUpdate}
          onHighlight={handleHighlight}
        />
        <DijkstraVisualizer
          onGraphChange={handleGraphUpdate}
          onHighlight={handleHighlight}
        />
        <MSTVisualizer
          onGraphChange={handleGraphUpdate}
          onHighlight={handleHighlight}
        />
        <GraphCanvas
          nodesData={allNodes}
          edgesData={allEdges}
          highlightEdges={highlightEdges}
        />
      </div>
    </div>
  );
}
