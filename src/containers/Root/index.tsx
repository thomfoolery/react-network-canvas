import React, { useRef, useMemo, useEffect, ReactNode } from "react";
import { Workspace } from "@component/containers";
import { themeToCssVars } from "@component/utils";
import {
  useCallbacks,
  useOptions,
  createGraphManager,
  createDragManager,
} from "@component/hooks";
import * as Types from "@component/types";

import styles from "./styles.module.css";

interface Props {
  nodes: Types.Node[];
  edges: Types.Edge[];
  theme?: any;
}

function Root(props: Props): ReactNode {
  const { nodes, edges, theme = {} } = props;
  const containerRef = useRef();
  const options = useOptions();
  const bridge = useCallbacks();

  const dragManager = useMemo(() => createDragManager(), []);
  const graphManager = useMemo(
    () =>
      createGraphManager({
        nodes,
        edges,
        bridge,
        options,
        dragManager,
      }),
    []
  );

  useEffect(() => {
    const { handleDragMove, handleDragEnd } = graphManager;

    if (bridge && "onMount" in bridge) {
      bridge?.onMount(graphManager);
    }

    dragManager.subscribeToDragMove("graphManager", handleDragMove);
    dragManager.subscribeToDragEnd("graphManager", handleDragEnd);

    return () => {
      dragManager.unsubscribeToDragMove("graphManager", handleDragMove);
      dragManager.unsubscribeToDragEnd("graphManager", handleDragEnd);
    };
  }, []);

  const { gridSize, canvasSize } = options;
  const style = {
    height: "100%",
    width: "100%",
    ...themeToCssVars({
      ...theme,
      gridSize: `${gridSize}px`,
      canvasSize: `${canvasSize}px`,
    }),
  };

  return (
    <div
      style={style}
      ref={containerRef}
      className={styles.NetworkCanvas}
      onMouseUp={dragManager?.handleDragEnd}
      onMouseLeave={dragManager?.handleDragEnd}
      onMouseDown={dragManager?.handleDragStart}
    >
      <Workspace />
    </div>
  );
}

export { Root };
