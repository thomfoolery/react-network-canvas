import React, {useMemo, useState} from "react";
import ReactDOM from "react-dom";
import {createElement} from "react";
import {v1 as generateUuid} from "uuid";

import {NetworkCanvas} from "@component";
import {
  Node as NodeComponent,
  Port as PortComponent,
  ZoomControls,
} from "./custom-components";

import styles from "./styles.module.css";

import graph from "./public/graph-2.json";

function App() {
  const {nodes, edges} = graph;
  const [zoom, setZoom] = useState(1);
  const [graphManager, setGraphManager] = useState();
  const [isDeleteVisible, setIsDeleteVisible] = useState();

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
          inputPorts: [{id: generateUuid(), label: "Input 1"}],
          outputPorts: [
            {id: generateUuid(), label: "Output 1"},
            {id: generateUuid(), label: "Output 2"},
          ],
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

        const node = graphManager.createNode({
          position,
          inputPorts: [{id: generateUuid(), label: "Input 1"}],
          outputPorts: [{id: generateUuid(), label: "Output 1"}],
        });

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
      onChangeSelectedNodeIds(selectedNodeIds) {
        if (selectedNodeIds.length > 0) {
          setIsDeleteVisible(true);
        } else {
          setIsDeleteVisible(false);
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
        stroke: "#00ffc8",
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
      selectBoxKey: "Meta",
      isSnapToGridEnabled: true,
      NodeComponent,
      PortComponent,
    }),
    []
  );

  return (
    <div style={{width: "100%", height: "100%"}}>
      <NetworkCanvas
        nodes={nodes}
        edges={edges}
        theme={theme}
        bridge={bridge}
        options={options}
      />
      <div className={styles.Controls}>
        <ZoomControls zoom={zoom} graphManager={graphManager} />
        <button onClick={() => alert(JSON.stringify(graphManager.export()))}>
          Export
        </button>
        {isDeleteVisible && (
          <button
            onClick={() =>
              graphManager.removeNodesByIds(graphManager.selectedNodeIds)
            }
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

ReactDOM.render(createElement(App), document.getElementById("app"));
