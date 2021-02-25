import React, {useRef, useState, useEffect, useCallback} from "react";
import Node from "../Node";
import Edge from "../Edge";

import {useDragManager, useGraphManager} from "@app/hooks";
import {isClick} from "@app/utils";

import styles from "./styles.module.css";

function Edges(props) {
  const {onClick = () => null} = props;
  const graphManager = useGraphManager();
  const dragManager = useDragManager();
  const containerRef = useRef();

  const [edges, setEdges] = useState(graphManager.edges);

  const handleMouseDown = useCallback(
    (event) => {
      if (event.target === containerRef.current) {
        graphManager.selectedNodeIds = [];
      }
    },
    [graphManager]
  );

  const handleMouseUp = useCallback(
    (event) => {
      if (isClick(dragManager.dragDelta)) {
        onClick(event);
      }
    },
    [dragManager]
  );

  useEffect(() => {
    graphManager.subscribeToEdgesChange(setEdges);
    return () => graphManager.unsubscribeToEdgesChange(setEdges);
  }, [graphManager]);

  return (
    <svg
      ref={containerRef}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      className={styles.CanvasEdges}
      xmlns="http://www.w3.org/2000/svg"
    >
      {edges.map((edge) => (
        <Edge key={edge.id} edge={edge} />
      ))}
    </svg>
  );
}

function Nodes() {
  const graphManager = useGraphManager();

  const [nodes, setNodes] = useState(graphManager.nodes);

  useEffect(() => {
    graphManager.subscribeToNodesChange(setNodes);
    return () => graphManager.unsubscribeToNodesChange(setNodes);
  }, [graphManager]);

  return (
    <>
      {nodes.map((node) => (
        <Node key={node.id} node={node} />
      ))}
    </>
  );
}

interface Props {
  onClick?(event): void;
}

function Canvas(props: Props) {
  const {onClick = () => null} = props;
  return (
    <div className={styles.Canvas} onClick={onClick}>
      <Edges />
      <Nodes />
    </div>
  );
}

export default Canvas;
