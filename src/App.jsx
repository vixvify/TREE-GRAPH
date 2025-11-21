import React from "react";
import GraphTraversal from "./components/GraphTraversal";
import DijkstraInteractive from "./components/DijkstraVisualizer";
import MSTVisualizer from "./components/MSTVisualizer";

export default function App() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0A0A0F] text-white">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-10 px-10">
        <GraphTraversal />
        <DijkstraInteractive />
        <MSTVisualizer />
      </div>
    </div>
  );
}
