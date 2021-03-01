import React, {useRef, useMemo, useEffect, useCallback} from "react";
import {Canvas} from "@app/containers";
import * as Types from "@app/types";
import {
  WorkspaceProvider,
  useBridge,
  usePanZoom,
  useOptions,
  useDragManager,
  useGraphManager,
} from "@app/hooks";

import styles from "./styles.module.css";

interface Props {}

function Workspace(props: Props) {
  const graphManager = useGraphManager();
  const dragManager = useDragManager();
  const options = useOptions();
  const bridge = useBridge();

  const {canvasSize, canvasMargin, startAtCanvasCenter} = options;

  const workspaceDivRef = useRef();
  const shiftKeyDownRef = useRef(false);

  const {transform, setContainer, panZoomRef, setPan, setZoom} = usePanZoom({
    canvasSize,
    canvasMargin,
    startAtCanvasCenter,
  });

  const workspace: Types.Workspace = useMemo(() => {
    return {
      setPan,
      setZoom,
      get container() {
        return workspaceDivRef.current;
      },
      get isShiftKeyDown() {
        return shiftKeyDownRef.current;
      },
      mountContextScreenOffset: {
        get x() {
          return workspaceDivRef.current.getBoundingClientRect().left;
        },
        get y() {
          return workspaceDivRef.current.getBoundingClientRect().top;
        },
      },
      get panZoom() {
        return panZoomRef.current;
      },
      getCanvasPosition(object) {
        const {zoom} = this.panZoom;

        if (object instanceof DOMRect) {
          return {
            x:
              (object.left - this.mountContextScreenOffset.x) / zoom -
              this.panZoom.x / zoom,
            y:
              (object.top - this.mountContextScreenOffset.y) / zoom -
              this.panZoom.y / zoom,
          };
        } else if ("clientX" in object && "clientY" in object) {
          return {
            x:
              (object.clientX - this.mountContextScreenOffset.x) / zoom -
              this.panZoom.x / zoom,
            y:
              (object.clientY - this.mountContextScreenOffset.y) / zoom -
              this.panZoom.y / zoom,
          };
        }

        throw Error("Unsupported object");
      },
    };
  }, [panZoomRef, workspaceDivRef, shiftKeyDownRef, setPan, setZoom]);

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
    dragManager.workspace = workspace;
    graphManager.bridge = bridge;
  }, [graphManager, dragManager, workspace, bridge]);

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
        <Canvas transform={transform} />
      </div>
    </WorkspaceProvider>
  );
}

export {Workspace};
