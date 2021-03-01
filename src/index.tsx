import React, {useRef} from "react";
import Workspace from "./components/Workspace";
import {
  GraphManagerProvider,
  DragManagerProvider,
  BridgeProvider,
} from "@app/hooks";

import * as Types from "@app/types";

import styles from "./styles.module.css";
import {themeToStyles} from "./theme";

interface Props {
  nodes: any[];
  edges: any[];
  theme?: any;
  options?: any;
  bridge?: Types.Bridge;
}

function NodeCanvas(props: Props) {
  const {nodes, edges, bridge, theme = {}, options = {}} = props;
  const containerRef = useRef();

  const {gridSize = 10, canvasSize = 2000} = options;

  const style = {
    ...themeToStyles({
      ...theme,
      gridSize: `${gridSize}px`,
      canvasSize: `${canvasSize}px`,
    }),
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
