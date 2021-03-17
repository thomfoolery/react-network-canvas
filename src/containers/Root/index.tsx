import React, {useRef, ReactNode} from "react";
import {Workspace} from "@component/containers";
import {themeToCssVars} from "@component/utils";
import {
  GraphManagerProvider,
  DragManagerProvider,
  OptionsProvider,
  BridgeProvider,
} from "@component/hooks";
import * as Types from "@component/types";

import styles from "./styles.module.css";

interface Props {
  nodes: Types.Node[];
  edges: Types.Edge[];
  options?: Partial<Types.Options>;
  bridge?: Types.Bridge;
  theme?: any;
}

function Root(props: Props): ReactNode {
  const {nodes, edges, bridge, options = {}, theme = {}} = props;
  const containerRef = useRef();

  const {gridSize, canvasSize} = options;

  const cssVars = {
    ...themeToCssVars({
      ...theme,
      gridSize: `${gridSize}px`,
      canvasSize: `${canvasSize}px`,
    }),
  };

  return (
    <OptionsProvider value={options}>
      <BridgeProvider value={bridge}>
        <DragManagerProvider>
          <div
            style={cssVars}
            ref={containerRef}
            className={styles.NetworkCanvas}
          >
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
