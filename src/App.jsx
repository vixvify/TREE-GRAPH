import React, { useEffect, useState, useRef } from "react";
import ForceGraph3D from "react-force-graph-3d";
import SpriteText from "three-spritetext";
import * as THREE from "three";

class Graph {
  constructor() {
    this.nodes = [
      { id: "A", x: 0, y: 0, z: 0 },
      { id: "B", x: 60, y: 0, z: 0 },
      { id: "C", x: 30, y: 50, z: 0 },
      { id: "D", x: 90, y: 50, z: 0 },
      { id: "E", x: 60, y: 100, z: 0 },
    ];

    this.links = [
      { source: "A", target: "B", weight: 2 },
      { source: "A", target: "C", weight: 1 },
      { source: "B", target: "C", weight: 3 },
      { source: "B", target: "D", weight: 2 },
      { source: "C", target: "E", weight: 4 },
      { source: "D", target: "E", weight: 5 },
    ];
  }

  // Prim's Algorithm
  primMST() {
    const nodes = this.nodes.map((n) => n.id);
    const edges = this.links;
    const mst = [];
    const visited = new Set();

    visited.add(nodes[0]); // start from A

    while (visited.size < nodes.length) {
      let minEdge = null;

      for (const edge of edges) {
        if (
          (visited.has(edge.source) && !visited.has(edge.target)) ||
          (visited.has(edge.target) && !visited.has(edge.source))
        ) {
          if (!minEdge || edge.weight < minEdge.weight) {
            minEdge = edge;
          }
        }
      }

      if (minEdge) {
        mst.push(minEdge);
        visited.add(minEdge.source);
        visited.add(minEdge.target);
      } else {
        break;
      }
    }

    return mst;
  }
}

export default function App() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [mstLinks, setMstLinks] = useState([]);
  const fgRef = useRef();

  useEffect(() => {
    const g = new Graph();
    setGraphData({ nodes: g.nodes, links: g.links });
  }, []);

  const runPrim = () => {
    const g = new Graph();
    const mst = g.primMST();
    setMstLinks(mst.map((l) => `${l.source}-${l.target}`));
  };

  const reset = () => setMstLinks([]);

  return (
    <div style={{ background: "#000", height: "100vh", paddingTop: "20px" }}>
      <h2 style={{ textAlign: "center", color: "white" }}>
        Prim’s Algorithm (3D Visualization)
      </h2>

      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <button
          onClick={runPrim}
          style={{
            background: "green",
            color: "white",
            border: "none",
            padding: "8px 14px",
            marginRight: "10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Run Prim
        </button>
        <button
          onClick={reset}
          style={{
            background: "red",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        nodeAutoColorBy="id"
        linkWidth={(link) =>
          mstLinks.includes(`${link.source.id}-${link.target.id}`) ? 5 : 1.5
        }
        linkColor={(link) =>
          mstLinks.includes(`${link.source.id}-${link.target.id}`)
            ? "red"
            : "gray"
        }
        nodeThreeObject={(node) => {
          const geometry = new THREE.SphereGeometry(5, 16, 16);
          const material = new THREE.MeshLambertMaterial({
            color: node.color || 0x8888ff,
          });
          const mesh = new THREE.Mesh(geometry, material);

          // Add text label (A, B, C...)
          const label = new SpriteText(node.id);
          label.color = "white";
          label.textHeight = 5;
          label.position.y += 8;
          mesh.add(label);

          return mesh;
        }}
        linkThreeObjectExtend={true}
        linkThreeObject={(link) => {
          const sprite = new SpriteText(`${link.weight}`);
          sprite.color = "white";
          sprite.textHeight = 4;
          sprite.position.z += 2; // ดันขึ้นนิดนึง
          return sprite;
        }}
        linkPositionUpdate={(sprite, { start, end }) => {
          const middlePos = {
            x: start.x + (end.x - start.x) / 2,
            y: start.y + (end.y - start.y) / 2 + 2, // ขยับขึ้น
            z: start.z + (end.z - start.z) / 2,
          };
          Object.assign(sprite.position, middlePos);
        }}
      />
    </div>
  );
}
