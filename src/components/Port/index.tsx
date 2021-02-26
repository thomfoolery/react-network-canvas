import React, {useCallback, SyntheticEvent} from "react";
import {
  useBridge,
  useDragManager,
  useGraphManager,
  useWorkspace,
} from "@app/hooks";
import {isClick, svgGeneratePath} from "@app/utils";
import {DRAFT_EDGE_ID} from "@app/constants";
import * as Types from "@app/types";

import styles from "./styles.module.css";

interface Props {
  port: Types.Port;
}

function Port(props: Props) {
  const {port} = props;
  const graphManager = useGraphManager();
  const dragManager = useDragManager();
  const workspace = useWorkspace();
  const bridge = useBridge();

  const handleMouseDown = useCallback(
    (event) => {
      const domElement = document.querySelector(`#Port-${port.id}`);
      const BB = {
        x: domElement?.getBoundingClientRect().left || 0,
        y: domElement?.getBoundingClientRect().top || 0,
        width: domElement?.getBoundingClientRect().width || 0,
        height: domElement?.getBoundingClientRect().height || 0,
      };

      const {scrollPosition} = workspace;

      graphManager.selectedNodeIds = [];
      dragManager.dragData = {
        dragType: "port",
        sourcePosition: {
          x: scrollPosition.left + BB.x + BB.width / 2,
          y: scrollPosition.top + BB.y + BB.height / 2,
        },
      };
    },
    [port, dragManager, graphManager, workspace]
  );

  const handleMouseUp = useCallback(
    (event) => {
      if (isClick(dragManager.dragDelta)) {
        bridge.onClickPort(event, port, graphManager);
      }
    },
    [port, graphManager]
  );

  return (
    <div
      id={`Port-${port.id}`}
      className={styles.Port}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
    ></div>
  );
}

export default Port;
