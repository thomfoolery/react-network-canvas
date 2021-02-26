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
  const workspaceRef = useWorkspace();
  const bridge = useBridge();

  const handleDragMove = useCallback(
    (event: SyntheticEvent, dragDelta: Types.Position, dragData: any) => {
      const svgPath = document.querySelector(`#Edge-${DRAFT_EDGE_ID}`);

      const x1 = dragData.sourcePosition.x;
      const y1 = dragData.sourcePosition.y;
      const x2 = workspaceRef.current.scrollLeft + event.clientX;
      const y2 = workspaceRef.current.scrollTop + event.clientY;

      const path = svgGeneratePath(x1, y1, x2, y2);

      svgPath?.setAttribute("d", path);
      svgPath?.nextElementSibling?.setAttribute("d", path);
    },
    [workspaceRef]
  );

  function clearDraftEdgePath() {
    const svgPath = document.querySelector(`#Edge-${DRAFT_EDGE_ID}`);

    svgPath?.setAttribute("d", "");
    svgPath?.nextElementSibling?.setAttribute("d", "");
  }

  const handleMouseDown = useCallback(
    (event) => {
      const domElement = document.querySelector(`#Port-${port.id}`);
      const BB = {
        x: domElement?.getBoundingClientRect().left || 0,
        y: domElement?.getBoundingClientRect().top || 0,
        width: domElement?.getBoundingClientRect().width || 0,
        height: domElement?.getBoundingClientRect().height || 0,
      };

      graphManager.selectedNodeIds = [];
      dragManager.dragData = {
        dragType: "port",
        sourcePosition: {
          x: workspaceRef.current.scrollLeft + BB.x + BB.width / 2,
          y: workspaceRef.current.scrollTop + BB.y + BB.height / 2,
        },
      };

      console.log(domElement);

      dragManager.subscribeToDragMove("port", handleDragMove);
      dragManager.subscribeToDragEnd("port", () => {
        clearDraftEdgePath();
        dragManager.unsubscribeToDragMove("port", handleDragMove);
      });
    },
    [port, dragManager, graphManager, workspaceRef]
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
