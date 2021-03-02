import React, {useRef} from "react";
import {Workspace} from "@component/containers";
import {
  GraphManagerProvider,
  DragManagerProvider,
  OptionsProvider,
  BridgeProvider,
} from "@component/hooks";

import * as Types from "@component/types";
import {themeToStyles} from "@component/theme";
import {defaultOptions} from "@component/options";

import styles from "./styles.module.css";

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

  const finalOptions = {
    ...defaultOptions,
    ...options,
  };

  const {gridSize, canvasSize} = finalOptions;

  const style = {
    ...themeToStyles({
      ...theme,
      gridSize: `${gridSize}px`,
      canvasSize: `${canvasSize}px`,
    }),
  };

  return (
    <OptionsProvider value={finalOptions}>
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

export {NodeCanvas};
