import React, { useMemo, useEffect, ReactNode } from "react";

import { Workspace } from "@component/containers";
import { themeToCssVars, createGraphManager } from "@component/utils";
import { useOptions, useDragManager, useCallbacks } from "@component/hooks";
import { GraphManagerProvider } from "@component/contexts";
import * as Types from "@component/types";

import styles from "./styles.module.css";

interface Props {
  nodes: Types.Node[];
  edges: Types.Edge[];
  theme?: any;
}

function Root(props: Props): ReactNode {
  const { nodes, edges, theme = {} } = props;
  const dragManager = useDragManager();
  const callbacks = useCallbacks();
  const options = useOptions();

  const graphManager = useMemo(
    () =>
      createGraphManager({
        nodes,
        edges,
        options,
        callbacks,
        dragManager,
      }),
    []
  );

  useEffect(() => {
    if (callbacks && "onMount" in callbacks) {
      callbacks?.onMount(graphManager);
    }
  }, [callbacks]);

  useEffect(() => {
    const { handleDragMove, handleDragEnd } = graphManager;
    dragManager.subscribeToDragMove("graphManager", handleDragMove);
    dragManager.subscribeToDragEnd("graphManager", handleDragEnd);

    return () => {
      dragManager.unsubscribeToDragMove("graphManager", handleDragMove);
      dragManager.unsubscribeToDragEnd("graphManager", handleDragEnd);
    };
  }, [dragManager]);

  const { gridSize, canvasSize } = options;
  const themeStyle = themeToCssVars({
    ...theme,
    gridSize: `${gridSize}px`,
    canvasSize: `${canvasSize}px`,
  });

  return (
    <GraphManagerProvider graphManager={graphManager}>
      <div style={themeStyle} className={styles.NetworkCanvas}>
        <Workspace />
      </div>
    </GraphManagerProvider>
  );
}

export { Root };
