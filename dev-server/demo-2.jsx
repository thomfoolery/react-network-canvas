import React, {useMemo, useState} from "react";
import ReactDOM from "react-dom";
import {createElement} from "react";
import {v1 as generateUuid} from "uuid";

import NodeCanvas from "../src/index";
import {
  Node as NodeComponent,
  Port as PortComponent,
  ZoomControls,
} from "./custom-components";

// import graph from "./public/graph.json";

const graph = {
  nodes: [],
  edges: [],
};

function App() {
  const {nodes, edges} = graph;
  const [zoom, setZoom] = useState(1);
  const [graphManager, setGraphManager] = useState();

  const bridge = useMemo(
    () => ({
      connect(graphManager) {
        setGraphManager(graphManager);
      },
      onChangeZoom(zoom) {
        setZoom(zoom);
      },
      onClickCanvas(event, position, graphManager) {
        const node = graphManager.createNode({
          position,
          outputPorts: [{id: generateUuid()}, {id: generateUuid()}],
        });

        graphManager.selectedNodeIds = [node.id];
      },
      onClickPort(event, port, parentNode, graphManager) {
        const parentNodeElement = document.querySelector(
          `#Node-${parentNode.id}`
        );
        const edgesOut = graphManager
          .getEdgesByNodeId(parentNode.id)
          .filter(({from}) => from.nodeId === parentNode.id);

        const BCR = parentNodeElement.getBoundingClientRect();
        const nodeDimensions = graphManager.workspace.getElementDimensions(
          parentNodeElement
        );
        const initialPosition = graphManager.workspace.getCanvasPosition(BCR);
        const position = edgesOut.reduce(
          (acc, edge) => {
            const nodeElement = document.querySelector(
              `#Node-${edge.to.nodeId}`
            );
            const BCR = nodeElement.getBoundingClientRect();
            const nodeDimensions = graphManager.workspace.getElementDimensions(
              nodeElement
            );
            const position = graphManager.workspace.getCanvasPosition(BCR);
            if (position.y >= acc.y) {
              return {
                ...acc,
                y: position.y + nodeDimensions.height + 20,
              };
            }
            return acc;
          },
          {
            x: initialPosition.x + nodeDimensions.width + 50,
            y: initialPosition.y,
          }
        );

        const node = graphManager.createNode({position});

        graphManager.createEdge({
          from: {
            nodeId: parentNode.id,
            portId: port.id,
          },
          to: {
            nodeId: node.id,
            portId: node.inputPorts[0].id,
          },
        });
        graphManager.selectedNodeIds = [node.id];
      },
      onKeyPress(event, key, graphManager) {
        if (key === "Backspace" && graphManager.selectedNodeIds.length > 0) {
          graphManager.removeNodesByIds(graphManager.selectedNodeIds);
        }
      },
    }),
    []
  );

  const theme = useMemo(
    () => ({
      workspace: {
        backgroundColor: "#222",
      },
      canvas: {
        boxShadow: "0 0 0 1px rgba(255,255,255,0.2)",
        backgroundColor: "#333",
        backgroundImage: [
          "radial-gradient(rgba(255,255,255,0.2)",
          "rgba(255,255,255,0.2) 1.5px,transparent 1.5px)",
        ].join(","),
        backgroundPosition: "-10px -10px",
      },
      edge: {
        stroke: "grey",
        strokeWidth: "3px",
        hover: {
          stroke: "red",
        },
        draft: {
          stroke: "cornflowerblue",
        },
      },
    }),
    []
  );

  const options = useMemo(
    () => ({
      minZoom: 0.5,
      maxZoom: 1.5,
      gridSize: 20,
      zoomWheelKey: "Shift",
      NodeComponent,
      PortComponent,
    }),
    []
  );

  return (
    <div style={{width: "100%", height: "100%"}}>
      <NodeCanvas
        nodes={nodes}
        edges={edges}
        theme={theme}
        bridge={bridge}
        options={options}
      />
      <ZoomControls zoom={zoom} graphManager={graphManager} />
    </div>
  );
}

ReactDOM.render(createElement(App), document.getElementById("app"));
