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
    const id = "graphManager";

    if (bridge && "onMount" in bridge) {
      bridge?.onMount(graphManager);
    }
    dragManager.subscribeToDragMove(id, graphManager.handleDragMove);
    dragManager.subscribeToDragEnd(id, graphManager.handleDragEnd);

    return () => {
      dragManager.unsubscribeToDragMove(id, graphManager.handleDragMove);
      dragManager.unsubscribeToDragEnd(id, graphManager.handleDragEnd);
    };
  }, []);

  const { gridSize, canvasSize } = options;
  const cssVars = {
    ...themeToCssVars({
      ...theme,
      gridSize: `${gridSize}px`,
      canvasSize: `${canvasSize}px`,
    }),
  };

  const style = {
    ...cssVars,
    width: "100%",
    height: "100%",
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
