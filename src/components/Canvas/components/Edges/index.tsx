import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  RefObject,
  SyntheticEvent,
} from "react";
import Edge from "@app/components/Edge";

import {
  useDragManager,
  useGraphManager,
  useWorkspace,
  useBridge,
} from "@app/hooks";
import {DRAFT_EDGE_ID} from "@app/constants";
import * as Types from "@app/types";
import {isClick} from "@app/utils";

import styles from "./styles.module.css";

const draftEdge = {
  id: DRAFT_EDGE_ID,
  from: {
    nodeId: "",
    portId: "",
  },
  to: {
    nodeId: "",
    portId: "",
  },
};

interface EdgeProps {
  onClick?(event: SyntheticEvent, position: Types.Position): void;
}

function Edges(props: EdgeProps) {
  const graphManager = useGraphManager();
  const dragManager = useDragManager();
  const workspace = useWorkspace();
  const bridge = useBridge();

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
        const position = {
          x: event.clientX + workspace.scrollPosition.left,
          y: event.clientY + workspace.scrollPosition.top,
        };
        bridge.onClickCanvas(event, position, graphManager);
      }
    },
    [bridge, dragManager, workspace]
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

      <Edge edge={draftEdge} />
    </svg>
  );
}

export default Edges;
