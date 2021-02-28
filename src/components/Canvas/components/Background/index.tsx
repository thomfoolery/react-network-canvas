import React, {
  memo,
  useRef,
  useState,
  useEffect,
  useCallback,
  SyntheticEvent,
} from "react";

import {
  useDragManager,
  useGraphManager,
  useWorkspace,
  useBridge,
} from "@app/hooks";

import {DRAFT_EDGE_ID} from "@app/constants";
import Edge from "@app/components/Edge";
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

interface BackgroundProps {
  onClick?(event: SyntheticEvent, position: Types.Position): void;
}

function Background(props: BackgroundProps) {
  const graphManager = useGraphManager();
  const dragManager = useDragManager();
  const workspace = useWorkspace();
  const bridge = useBridge();

  const containerRef = useRef();

  const [edges, setEdges] = useState(graphManager.edges);

  const handleMouseDown = useCallback(
    (event) => {
      if (event.target === containerRef.current) {
        dragManager.dragData = {type: "panzoom"};
        graphManager.selectedNodeIds = [];
      }
    },
    [dragManager, graphManager, containerRef]
  );

  const handleMouseUp = useCallback(
    (event) => {
      if (
        isClick(dragManager.dragDelta) &&
        containerRef.current === event.target
      ) {
        const position = workspace.getCanvasPosition(event);

        bridge.onClickCanvas(event, position, graphManager);
      }
    },
    [bridge, dragManager, workspace, containerRef]
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
      xmlns="http://www.w3.org/2000/svg"
      className={styles.CanvasBackground}
    >
      {edges.map((edge) => (
        <Edge key={edge.id} edge={edge} />
      ))}
      <Edge isDraft edge={draftEdge} />
    </svg>
  );
}

export default memo(Background);
