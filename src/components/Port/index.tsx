import React, {useCallback, SyntheticEvent} from "react";
import {
  useBridge,
  useDragManager,
  useGraphManager,
  useWorkspace,
} from "@app/hooks";
import {isClick} from "@app/utils";
import * as Types from "@app/types";

import styles from "./styles.module.css";

interface Props {
  node: Types.Node;
  port: Types.Port;
  type: "input" | "output";
}

function Port(props: Props) {
  const {node, port, type} = props;
  const graphManager = useGraphManager();
  const dragManager = useDragManager();
  const workspace = useWorkspace();
  const bridge = useBridge();

  const handleMouseDown = useCallback(() => {
    if (type === "output") {
      const domElement = document.querySelector(`#Port-${port.id}`);

      if (domElement) {
        const BCR = domElement.getBoundingClientRect();
        const position = workspace.getCanvasPosition(BCR);

        graphManager.selectedNodeIds = [];
        dragManager.dragData = {
          dragType: "port",
          port: {
            ...port,
            type,
            parentNode: node,
            position: {
              x: position.x + domElement.clientWidth / 2,
              y: position.y + domElement.clientHeight / 2,
            },
          },
        };
      }
    }
  }, [node, port, dragManager, graphManager, workspace]);

  const handleMouseUp = useCallback(
    (event: SyntheticEvent) => {
      const {dragData} = dragManager;
      if (isClick(dragManager.dragDelta)) {
        bridge.onClickPort(event, port, node, graphManager);
      } else if (
        dragData.port &&
        type === "input" &&
        dragData.port.type === "output"
      ) {
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
    [node, port, type, dragManager, graphManager]
  );

  const classList = [
    styles.Port,
    type === "input" ? styles.Input : styles.Output,
  ];

  return (
    <div
      id={`Port-${port.id}`}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      className={classList.join(" ")}
    ></div>
  );
}

export default Port;
