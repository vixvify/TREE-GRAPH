import React from "react";
import GraphTraversal from "./components/GraphTraversal";
import DijkstraVisualizer from "./components/DijkstraVisualizer";
import MSTVisualizer from "./components/MSTVisualizer";

export default function App() {
  return (
    <div className="">
      <h1 className="lg:text-6xl text-4xl font-bold text-center mt-20">
        PROJECT CSS 113
      </h1>
      <div className="flex flex-col lg:flex-row justify-center items-center gap-10 mt-20">
        <GraphTraversal />
        <DijkstraVisualizer />
        <MSTVisualizer />
      </div>
    </div>
  );
}
