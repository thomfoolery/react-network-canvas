import React, {useRef, useMemo, useEffect, useCallback} from "react";
import Canvas from "../Canvas";
import {
  WorkspaceProvider,
  useBridge,
  usePanZoom,
  useDragManager,
  useGraphManager,
} from "@app/hooks";

import styles from "./styles.module.css";

interface Props {
  canvasSize: number;
  containerWidth?: number;
  containerHeight?: number;
}

function Workspace(props: Props) {
  const {canvasSize, containerWidth = 0, containerHeight = 0} = props;
  const graphManager = useGraphManager();
  const dragManager = useDragManager();
  const bridge = useBridge();

  const workspaceDivRef = useRef();
  const shiftKeyDownRef = useRef(false);

  const {transform, setContainer, panZoomRef} = usePanZoom({
    container: workspaceDivRef.current,
    // minX: canvasSize * -1 + containerWidth,
    // minY: canvasSize * -1 + containerHeight,
    // maxX: 0,
    // maxY: 0,
  });

  setContainer(workspaceDivRef.current);

  const workspace = useMemo(() => {
    return {
      get container() {
        return workspaceDivRef.current;
      },
      get isShiftKeyDown() {
        return shiftKeyDownRef.current;
      },
      offset: {
        get x() {
          return workspaceDivRef.current.getBoundingClientRect().left;
        },
        get y() {
          return workspaceDivRef.current.getBoundingClientRect().top;
        },
      },
      canvasPanZoom: {
        get x() {
          return panZoomRef.current.x;
        },
        get y() {
          return panZoomRef.current.y;
        },
        get zoom() {
          return panZoomRef.current.zoom;
        },
      },
      getCanvasPosition(object) {
        if (object instanceof DOMRect) {
          return {
            x: object.left - this.offset.x - this.canvasPanZoom.x,
            y: object.top - this.offset.y - this.canvasPanZoom.y,
          };
        } else {
          return {
            x: object.clientX - this.offset.x - this.canvasPanZoom.x,
            y: object.clientY - this.offset.y - this.canvasPanZoom.y,
          };
        }
      },
    };
  }, [panZoomRef, workspaceDivRef, shiftKeyDownRef]);

  const handleMouseDown = useCallback(
    (event) => {
      if (event.target === workspaceDivRef.current) {
        dragManager.dragData = {type: "panzoom"};
      }
    },
    [dragManager, graphManager, workspaceDivRef]
  );

  const handleRef = useCallback(
    (el) => {
      workspaceDivRef.current = el;
      setContainer(el);
    },
    [workspaceDivRef, setContainer]
  );

  useEffect(() => {
    graphManager.dragManager = dragManager;
    graphManager.workspace = workspace;
  }, [graphManager, dragManager, workspace]);

  useEffect(() => {
    function handleKeyUp(event) {
      bridge.onKeyPress(event, event.key, graphManager);
    }

    document.addEventListener("keyup", handleKeyUp);
    return () => document.removeEventListener("keyup", handleKeyUp);
  }, [bridge, workspace, graphManager]);

  useEffect(() => {
    function handleKeyDown({key}) {
      if (key === "Shift") shiftKeyDownRef.current = true;
    }
    function handleKeyUp({key}) {
      if (key === "Shift") shiftKeyDownRef.current = false;
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [shiftKeyDownRef]);

  return (
    <WorkspaceProvider value={workspace}>
      <div
        ref={handleRef}
        className={styles.Workspace}
        onMouseDown={handleMouseDown}
      >
        <div style={{transform}}>
          <Canvas />
        </div>
      </div>
    </WorkspaceProvider>
  );
}

export default Workspace;
