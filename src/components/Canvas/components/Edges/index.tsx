import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  RefObject,
  SyntheticEvent,
} from "react";
import Edge from "@app/components/Edge";

import {useDragManager, useGraphManager, useBridge} from "@app/hooks";
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
  workspaceDivRef: RefObject<HTMLDivElement>;
}

function Edges(props: EdgeProps) {
  const {workspaceDivRef} = props;

  const graphManager = useGraphManager();
  const dragManager = useDragManager();
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
          x: event.clientX + workspaceDivRef.current.scrollLeft,
          y: event.clientY + workspaceDivRef.current.scrollTop,
        };
        bridge.onClickCanvas(event, position, graphManager);
      }
    },
    [bridge, dragManager, workspaceDivRef]
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
