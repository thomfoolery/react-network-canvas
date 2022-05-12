import React, { useCallback, ReactNode, SyntheticEvent } from "react";
import {
  useCallbacks,
  useOptions,
  useWorkspace,
  useDragManager,
  useGraphManager,
} from "@component/hooks";
import { isClick } from "@component/utils";
import * as Types from "@component/types";

interface Props {
  key: string;
  node: Types.Node;
  port: Types.Port;
  type: "input" | "output";
  index?: number;
}

function Port(props: Props): ReactNode {
  const { node, port, type, index } = props;
  const graphManager = useGraphManager();
  const dragManager = useDragManager();
  const workspace = useWorkspace();
  const options = useOptions();
  const callbacks = useCallbacks();

  const { PortComponent } = options;

  const handleMouseDown = useCallback(() => {
    if (type === "output") {
      const domElement = document.querySelector(`#Port-${port.id}`);

      if (domElement) {
        const BCR = domElement.getBoundingClientRect();
        const position = workspace.getCanvasPosition(BCR);

        graphManager.selectedNodeIds = [];
        dragManager.dragData = {
          source: "port",
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
      const { dragData } = dragManager;
      if (isClick(dragManager.dragDelta)) {
        callbacks.onClickPort(event, port, node, graphManager);
      } else if (
        dragData?.port &&
        type === "input" &&
        dragData?.port.type === "output"
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

        // clear dragData to prevent the mouse up handler on the
        // parent Node doesnt try to duplicate this edge
        dragManager.dragData = {
          ...dragManager.dragData,
          source: null,
        };
      }
    },
    [node, port, type, dragManager, graphManager]
  );

  return (
    <PortComponent
      node={node}
      port={port}
      type={type}
      index={index}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
    />
  );
}

export { Port };
