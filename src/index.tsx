import React from "react";
import Workspace from "./components/Workspace";
import {DragManagerProvider, GraphManagerProvider} from "./hooks";

import styles from "./styles.module.css";

interface Props {
  nodes: any[];
  edges: any[];
  canvasSize: number;
}

function NodeCanvas(props: Props) {
  const {nodes, edges, canvasSize = 2000} = props;
  const style = {
    "--canvas-size": `${canvasSize}px`,
  };

  return (
    <DragManagerProvider>
      <div className={styles.NodeCanvas} style={style}>
        <GraphManagerProvider nodes={nodes} edges={edges}>
          <Workspace />
        </GraphManagerProvider>
      </div>
    </DragManagerProvider>
  );
}

export default NodeCanvas;
