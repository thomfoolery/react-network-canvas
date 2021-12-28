import React, { useMemo, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { createElement } from "react";
import { v1 as generateUuid } from "uuid";

import { NetworkCanvas } from "@component";
import {
  Node as NodeComponent,
  Port as PortComponent,
  ZoomControls,
  Keyboard,
  Palette,
  Modal,
} from "../custom-components";

import styles from "./styles.module.css";

// import graph from "./graph-2.json";

const initialGraph = { nodes: [], edges: [] };

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
  const [isHelpVisible, setIsHelpVisible] = useState();
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDeleteVisible, setIsDeleteVisible] = useState();

  const { nodes, edges } = graph;

  const onMount = useCallback((graphManager) => {
    setGraphManager(graphManager);
  }, []);
  const onChangeZoom = useCallback((zoom) => {
    setZoom(zoom);
  }, []);
  const onMutateGraph = useCallback((graphEvent) => {
    setGraph(graphEvent.graph);
    setSavedState(graphEvent.graph);
  }, []);
  const onDropCanvas = useCallback((event, position, graphManager) => {
    event.preventDefault();

    const type = event.dataTransfer.getData("text/plain");
    const node = graphManager.createNode({
      position,
      data: {
        type,
      },
      inputPorts: type !== "MIDI" ? [{ id: generateUuid(), label: "In" }] : [],
      outputPorts:
        type !== "DEST" ? [{ id: generateUuid(), label: "Out" }] : [],
    });

    graphManager.selectedNodeIds = [node.id];
  }, []);
  const onKeyPress = useCallback((event, key, graphManager) => {
    if (key === "Backspace" && graphManager.selectedNodeIds.length > 0) {
      graphManager.removeNodesByIds(graphManager.selectedNodeIds);
    }
  }, []);
  const onChangeSelectedNodeIds = useCallback(
    (selectedNodeIds, graphManager) => {
      if (selectedNodeIds.length > 0) {
        setIsDeleteVisible(true);
        if (selectedNodeIds.length === 1) {
          setSelectedNode(
            graphManager.nodes.find(({ id }) => id === selectedNodeIds[0])
          );
        } else {
          setSelectedNode(null);
        }
      } else {
        setSelectedNode(null);
        setIsDeleteVisible(false);
      }
    },
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
      initialPanOffset: { x: 150, y: 70 },
      NodeComponent,
      PortComponent,
    }),
    []
  );

  const isClearVisible = graph?.nodes.length > 0;

  const handleClickHelp = () => setIsHelpVisible(true);
  const closeHelp = () => setIsHelpVisible(false);

  const handleClickDelete = () =>
    graphManager.removeNodesByIds(graphManager.selectedNodeIds);

  const handleClickClear = () =>
    graphManager.removeNodesByIds(graphManager.nodes.map(({ id }) => id));

  const handleClickExport = () => alert(JSON.stringify(graphManager.export()));

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <NetworkCanvas
        nodes={nodes}
        edges={edges}
        theme={theme}
        options={options}
        onMount={onMount}
        onChangeZoom={onChangeZoom}
        onMutateGraph={onMutateGraph}
        onDropCanvas={onDropCanvas}
        onKeyPress={onKeyPress}
        onChangeSelectedNodeIds={onChangeSelectedNodeIds}
      />
      <div className={styles.Palette}>
        <Palette />
      </div>
      <div className={styles.Controls}>
        <ZoomControls zoom={zoom} graphManager={graphManager} />
        <button onClick={handleClickExport}>Export</button>
        {isDeleteVisible && <button onClick={handleClickDelete}>Delete</button>}
        {isClearVisible && <button onClick={handleClickClear}>Clear</button>}
        <button onClick={handleClickHelp} className={styles.HelpButton}>
          ?
        </button>
      </div>
      {selectedNode && (
        <div className={styles.NodeDetails}>
          {selectedNode.data.type === "SRC" ? (
            <div>
              <Keyboard />
            </div>
          ) : (
            <pre>{JSON.stringify(selectedNode, null, 2)}</pre>
          )}
        </div>
      )}
      {isHelpVisible && (
        <Modal onClose={closeHelp}>
          <div>
            <table>
              <tbody>
                <tr>
                  <td>Meta + Click and Drag</td>
                  <td>=</td>
                  <td>Multi-select</td>
                </tr>
                <tr>
                  <td>Shift + Scroll Wheel</td>
                  <td>=</td>
                  <td>Zoom</td>
                </tr>
                <tr>
                  <td>Click and Drag</td>
                  <td>=</td>
                  <td>Pan</td>
                </tr>
                <tr>
                  <td>Touch pad</td>
                  <td>=</td>
                  <td>Pan</td>
                </tr>
                <tr>
                  <td>Click and drag from output to node</td>
                  <td>=</td>
                  <td>Create connection</td>
                </tr>
                <tr>
                  <td>Click connection</td>
                  <td>=</td>
                  <td>Delete connection</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
}

ReactDOM.render(createElement(App), document.getElementById("app"));
