import React, {useRef} from "react";
import Workspace from "./components/Workspace";
import {
  GraphManagerProvider,
  DragManagerProvider,
  BridgeProvider,
} from "@app/hooks";

import * as Types from "@app/types";

import styles from "./styles.module.css";

interface Props {
  nodes: any[];
  edges: any[];
  bridge?: Types.Bridge;
  gridSize?: number;
  canvasSize?: number;
}

function NodeCanvas(props: Props) {
  const {nodes, edges, bridge, gridSize = 10, canvasSize = 2000} = props;
  const containerRef = useRef();
  const style = {
    "--grid-size": `${gridSize}px`,
    "--canvas-size": `${canvasSize}px`,
  };

  return (
    <BridgeProvider value={bridge}>
      <DragManagerProvider>
        <div style={style} ref={containerRef} className={styles.NodeCanvas}>
          <GraphManagerProvider nodes={nodes} edges={edges}>
            <Workspace canvasSize={canvasSize} />
          </GraphManagerProvider>
        </div>
      </DragManagerProvider>
    </BridgeProvider>
  );
}

export default NodeCanvas;
