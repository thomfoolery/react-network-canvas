import React, {useMemo, useState, useCallback} from "react";
import ReactDOM from "react-dom";
import {createElement} from "react";
import {v1 as generateUuid} from "uuid";

import {NetworkCanvas} from "@component";
import {
  Node as NodeComponent,
  Port as PortComponent,
  ZoomControls,
  Palette,
} from "./custom-components";

import styles from "./styles.module.css";

// import graph from "./public/graph-2.json";

const initialGraph = {nodes: [], edges: []};

function getSavedState() {
  try {
    return JSON.parse(localStorage.getItem("savedState")) || initialGraph;
  } catch (err) {
    return initialGraph;
  }
}

function setSavedState(state) {
  localStorage.setItem("savedState", JSON.stringify(state));
}

function App() {
  const [zoom, setZoom] = useState(1);
  const [graph, setGraph] = useState(getSavedState());
  const [graphManager, setGraphManager] = useState();
  const [isDeleteVisible, setIsDeleteVisible] = useState();

  const {nodes, edges} = graph;

  const bridge = useMemo(
    () => ({
      connect(graphManager) {
        setGraphManager(graphManager);
      },
      onChangeZoom(zoom) {
        setZoom(zoom);
      },
      onMutateGraph(graphEvent) {
        setGraph(graphEvent.graph);
        setSavedState(graphEvent.graph);
      },
      onDropCanvas(event, position, graphManager) {
        event.preventDefault();

        const type = event.dataTransfer.getData("text/plain");
        const node = graphManager.createNode({
          position,
          data: {
            type,
          },
          inputPorts: type !== "SRC" ? [{id: generateUuid(), label: "In"}] : [],
          outputPorts:
            type !== "DEST" ? [{id: generateUuid(), label: "Out"}] : [],
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
        backgroundColor: "#050a14",
      },
      canvas: {
        backgroundColor: "#040d21",
        boxShadow: "0 0 0 2px #00ffc844",
        backgroundImage: [
          "radial-gradient(rgba(162, 250, 207, 0.2), rgba(162, 250, 207, 0.2) 1px, transparent 1px, transparent)",
        ].join(","),
        backgroundPosition: "-10px -10px",
      },
      selectbox: {
        backgroundColor: "#00ffc822",
        boxShadow: "0 0 0 1px #00ffc8",
      },
      edge: {
        stroke: "#00ffc8",
        strokeWidth: "3px",
        hover: {
          stroke: "#ff00dd",
        },
        draft: {
          stroke: "#00ffc8",
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
      selectBoxKey: "Meta",
      zoomWheelKey: "Shift",
      isSnapToGridEnabled: true,
      initialPanOffset: {x: 150, y: 70},
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
      <div className={styles.Palette}>
        <Palette />
      </div>
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
        {graph?.nodes.length > 0 && (
          <button
            onClick={() =>
              graphManager.removeNodesByIds(
                graphManager.nodes.map(({id}) => id)
              )
            }
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

ReactDOM.render(createElement(App), document.getElementById("app"));
