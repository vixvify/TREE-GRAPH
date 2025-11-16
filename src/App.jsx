import React from "react";
import GraphTraversal from "./components/GraphTraversal";
import DijkstraVisualizer from "./components/DijkstraVisualizer";
import MSTVisualizer from "./components/MSTVisualizer";

export default function App() {
  return (
    <div className="flex justify-center items-center gap-10 h-screen">
      <GraphTraversal />
      <DijkstraVisualizer />
      <MSTVisualizer />
    </div>
  );
}
