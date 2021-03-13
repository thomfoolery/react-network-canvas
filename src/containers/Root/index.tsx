import React, {useRef} from "react";
import {Workspace} from "@component/containers";
import {themeToStyles} from "@component/utils";
import {
  GraphManagerProvider,
  DragManagerProvider,
  OptionsProvider,
  BridgeProvider,
} from "@component/hooks";

import styles from "./styles.module.css";

function Root(props) {
  const {nodes, edges, bridge, theme = {}, options = {}} = props;
  const containerRef = useRef();

  const {gridSize, canvasSize} = options;

  const style = {
    ...themeToStyles({
      ...theme,
      gridSize: `${gridSize}px`,
      canvasSize: `${canvasSize}px`,
    }),
  };

  return (
    <OptionsProvider value={options}>
      <BridgeProvider value={bridge}>
        <DragManagerProvider>
          <div style={style} ref={containerRef} className={styles.NodeCanvas}>
            <GraphManagerProvider nodes={nodes} edges={edges}>
              <Workspace />
            </GraphManagerProvider>
          </div>
        </DragManagerProvider>
      </BridgeProvider>
    </OptionsProvider>
  );
}

export {Root};
