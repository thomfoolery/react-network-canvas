import React, {
  memo,
  useRef,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

import {
  useDragManager,
  useGraphManager,
  useWorkspace,
  useCallbacks,
  useOptions,
} from "@component/hooks";

import { DRAFT_EDGE_ID } from "@component/constants";
import { Edge } from "@component/containers";
import { isClick } from "@component/utils";

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

function Component(): ReactNode {
  const graphManager = useGraphManager();
  const dragManager = useDragManager();
  const workspace = useWorkspace();
  const callbacks = useCallbacks();
  const options = useOptions();

  const containerRef = useRef();

  const [edges, setEdges] = useState(graphManager.edges);

  const handleMouseDown = useCallback(
    (event) => {
      if (event.target === containerRef.current) {
        dragManager.dragData = { source: "panzoom" };
      }
    },
    [dragManager, containerRef]
  );

  const handleMouseUp = useCallback(
    (event) => {
      if (
        event.target === containerRef.current &&
        graphManager.selectedNodeIds.length > 0
      ) {
        graphManager.selectedNodeIds = [];
      } else if (
        isClick(dragManager.dragDelta) &&
        event.target === containerRef.current
      ) {
        const position = workspace.getCanvasPosition(event);

        callbacks.onClickCanvas(event, position, graphManager);
      }
    },
    [callbacks, workspace, dragManager, graphManager, containerRef]
  );

  useEffect(() => {
    graphManager.subscribeToEdgesChange("canvas", setEdges);
    return () => graphManager.unsubscribeToEdgesChange("canvas", setEdges);
  }, [graphManager]);

  return (
    <svg
      ref={containerRef}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      xmlns="http://www.w3.org/2000/svg"
      className={styles.CanvasBackground}
      data-testid="CanvasBackground"
    >
      {options.SvgEdgeMarkersDefs}
      {edges.map((edge) => (
        <Edge key={edge.id} edge={edge} />
      ))}
      <Edge isDraft edge={draftEdge} />
    </svg>
  );
}

const CanvasBackground = memo(Component);

export { CanvasBackground };
