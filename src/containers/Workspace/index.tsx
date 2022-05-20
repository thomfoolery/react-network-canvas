import React, {
  useRef,
  useMemo,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { WorkspaceProvider } from "@component/contexts";
import { createWorkspace } from "@component/utils";
import { Canvas } from "@component/containers";
import * as Types from "@component/types";
import {
  useCallbacks,
  usePanZoom,
  useOptions,
  useDragManager,
  useGraphManager,
} from "@component/hooks";

import styles from "./styles.module.css";

function Workspace(): ReactNode {
  const graphManager = useGraphManager();
  const dragManager = useDragManager();
  const options = useOptions();
  const callbacks = useCallbacks();

  const {
    minZoom,
    maxZoom,
    canvasSize,
    canvasMargin,
    zoomWheelKey,
    selectBoxKey,
    zoomSensitivity,
    startAtCanvasCenter,
  } = options;

  const workspaceDivRef = useRef();
  const isSelectBoxKeyDownRef = useRef(false);

  const initialPan = useMemo(() => {
    const container = workspaceDivRef.current;

    if (!container) {
      return null;
    }

    const {
      initialPanOffset = {
        x: canvasMargin,
        y: canvasMargin,
      },
    } = options;

    if (startAtCanvasCenter) {
      return {
        x: (canvasSize / 2 - container.clientWidth / 2) * -1,
        y: (canvasSize / 2 - container.clientHeight / 2) * -1,
      };
    }

    return initialPanOffset;
  }, [workspaceDivRef.current]);

  const onChangeZoom = useCallback(
    (zoom) => callbacks.onChangeZoom(zoom),
    [callbacks]
  );

  const {
    setPan,
    setZoom,
    transform,
    panZoomRef,
    setContainer,
    isInitialized: isPanZoomInitialized,
  } = usePanZoom({
    minZoom,
    maxZoom,
    initialPan,
    canvasSize,
    canvasMargin,
    zoomWheelKey,
    zoomSensitivity,
    onChangeZoom,
  });

  const handleRef = useCallback(
    (el) => {
      workspaceDivRef.current = el;
      setContainer(el);
    },
    [graphManager, workspaceDivRef, setContainer]
  );

  const workspace: Types.Workspace = useMemo(() => {
    if (workspaceDivRef.current) {
      return createWorkspace({
        panZoomRef,
        workspaceDivRef,
        isSelectBoxKeyDownRef,
        setPan,
        setZoom,
      });
    }
  }, [panZoomRef, workspaceDivRef, isSelectBoxKeyDownRef, setPan, setZoom]);

  const handleDrop = useCallback(
    (event) => {
      const position = workspace.getCanvasPosition(event);
      callbacks.onDropCanvas(event, position, graphManager);
    },
    [callbacks, workspace, graphManager]
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleMouseDown = useCallback(
    (event) => {
      if (event.target === workspaceDivRef.current) {
        dragManager.dragData = { source: "panzoom" };
      }
    },
    [dragManager, graphManager, workspaceDivRef]
  );

  // on mouse leaves workspace
  // reset key tracker
  const handleMouseLeave = useCallback(() => {
    isSelectBoxKeyDownRef.current = false;
  }, []);

  // on page blur
  // reset key tracker
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden) {
        isSelectBoxKeyDownRef.current = false;
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
      false
    );
    return () =>
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
        false
      );
  }, []);

  useEffect(() => {
    graphManager.workspace = workspace;
    dragManager.workspace = workspace;
  }, [graphManager, workspace]);

  useEffect(() => {
    function handleKeyUp(event) {
      callbacks.onKeyPress(event, event.key, graphManager);
    }

    document.addEventListener("keyup", handleKeyUp);
    return () => document.removeEventListener("keyup", handleKeyUp);
  }, [callbacks, workspace, graphManager]);

  useEffect(() => {
    function handleKeyDown({ key }) {
      if (key === selectBoxKey) isSelectBoxKeyDownRef.current = true;
    }
    function handleKeyUp({ key }) {
      if (key === selectBoxKey) isSelectBoxKeyDownRef.current = false;
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [selectBoxKey, isSelectBoxKeyDownRef]);

  return (
    <WorkspaceProvider workspace={workspace}>
      <div
        ref={handleRef}
        className={styles.Workspace}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
      >
        {isPanZoomInitialized && <Canvas transform={transform} />}
      </div>
    </WorkspaceProvider>
  );
}

export { Workspace };
