import React, {useRef, useEffect, useCallback, SyntheticEvent} from "react";
import * as Types from "@app/types";

import {useDragManager, useGraphManager, useWorkspace} from "@app/hooks";
import {isClick} from "@app/utils";

import {CanvasBackground, CanvasForeground} from "@app/containers";

import styles from "./styles.module.css";

interface Props {
  transform: string;
  onClick?(event: SyntheticEvent, position: Types.Position): void;
}

function Canvas(props: Props) {
  const {transform, onClick = () => null} = props;
  const workspace = useWorkspace();
  const dragManager = useDragManager();
  const graphManager = useGraphManager();

  const selectBoxRef = useRef();

  const handleMouseDown = useCallback((event) => {
    if (workspace.isShiftKeyDown) {
      dragManager.dragData = {
        type: "selectbox",
        startPosition: workspace.getCanvasPosition(event),
      };
    }
  }, []);

  useEffect(() => {
    function handleDragMove(event, dragDelta, dragData) {
      if (dragData.type === "selectbox") {
        drawSelectBox(dragDelta, dragData, selectBoxRef.current);
      }
    }

    function handleDragEnd(event, dragDelta, dragData) {
      if (dragData.type === "selectbox" && !isClick(dragDelta)) {
        const [x1, y1, x2, y2] = getSelectBoxCoordinates(selectBoxRef.current);
        const selectedNodeIds = graphManager.nodes.reduce((acc, node) => {
          const nodeElement: HTMLDivElement | null = document.querySelector(
            `#Node-${node.id}`
          );
          if (nodeElement) {
            const x = parseInt(nodeElement.style.left, 10);
            const y = parseInt(nodeElement.style.top, 10);
            const width = nodeElement.clientWidth;
            const height = nodeElement.clientHeight;

            if (x > x1 && y > y1 && x + width < x2 && y + height < y2) {
              return [...acc, node.id];
            }
          }
          return acc;
        }, []);

        graphManager.selectedNodeIds = selectedNodeIds;
      }
      clearSelectBox(selectBoxRef.current);
    }

    dragManager.subscribeToDragMove("selectbox", handleDragMove);
    dragManager.subscribeToDragEnd("selectbox", handleDragEnd);

    return () => {
      dragManager.unsubscribeToDragMove("selectbox", handleDragMove);
      dragManager.unsubscribeToDragEnd("selectbox", handleDragEnd);
    };
  }, [workspace, dragManager, graphManager]);

  return (
    <div
      onClick={onClick}
      style={{transform}}
      className={styles.Canvas}
      onMouseDown={handleMouseDown}
    >
      <div ref={selectBoxRef} className={styles.SelectBox} />
      <CanvasBackground />
      <CanvasForeground />
    </div>
  );
}

function getSelectBoxCoordinates(element) {
  const {style} = element;
  const x1 = parseInt(style.left, 10);
  const y1 = parseInt(style.top, 10);
  const x2 = parseInt(style.left, 10) + parseInt(style.width, 10);
  const y2 = parseInt(style.top, 10) + parseInt(style.height, 10);

  return [x1, y1, x2, y2];
}

function drawSelectBox(dragDelta, dragData, element) {
  const {style} = element;

  style.left = `${Math.min(
    dragData.startPosition.x,
    dragData.startPosition.x + dragDelta.x
  )}px`;
  style.top = `${Math.min(
    dragData.startPosition.y,
    dragData.startPosition.y + dragDelta.y
  )}px`;
  style.width = `${Math.abs(dragDelta.x)}px`;
  style.height = `${Math.abs(dragDelta.y)}px`;
  style.opacity = 1;
}

function clearSelectBox(element) {
  element.style = "";
}

export {Canvas};
