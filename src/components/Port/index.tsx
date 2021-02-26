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
  node: Types.Node;
  port: Types.Port;
}

function Port(props: Props) {
  const {node, port} = props;
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
        port: {
          ...port,
          parentNode: node,
          position: {
            x: scrollPosition.left + BB.x + BB.width / 2,
            y: scrollPosition.top + BB.y + BB.height / 2,
          },
        },
      };
    },
    [node, port, dragManager, graphManager, workspace]
  );

  const handleMouseUp = useCallback(
    (event) => {
      const {dragData} = dragManager;
      if (isClick(dragManager.dragDelta)) {
        bridge.onClickPort(event, port, graphManager);
      } else if (dragData.port) {
        const edge = {
          from: {
            nodeId: dragData.port.parentNode.id,
            portId: dragData.port.id,
          },
          to: {
            nodeId: node.id,
            portId: port.id,
          },
        };

        graphManager.createEdge(edge);
      }
    },
    [node, port, dragManager, graphManager]
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
