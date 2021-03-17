import React, {useRef, useMemo, useEffect, useCallback} from "react";
import {Canvas} from "@component/containers";
import * as Types from "@component/types";
import {
  useBridge,
  usePanZoom,
  useOptions,
  useDragManager,
  useGraphManager,
  createWorkspace,
  WorkspaceProvider,
} from "@component/hooks";

import styles from "./styles.module.css";

interface Props {}

function Workspace(props: Props) {
  const graphManager = useGraphManager();
  const dragManager = useDragManager();
  const options = useOptions();
  const bridge = useBridge();

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

  const onChangeZoom = useCallback((zoom) => bridge.onChangeZoom(zoom), [
    bridge,
  ]);

  const {
    setPan,
    setZoom,
    transform,
    panZoomRef,
    setContainer,
    setWorkspace,
  } = usePanZoom({
    minZoom,
    maxZoom,
    canvasSize,
    canvasMargin,
    zoomWheelKey,
    zoomSensitivity,
    startAtCanvasCenter,
    onChangeZoom,
  });

  const handleRef = useCallback(
    (el) => {
      workspaceDivRef.current = el;
      setContainer(el);
    },
    [workspaceDivRef, setContainer]
  );

  const workspace: Types.Workspace = useMemo(
    () =>
      createWorkspace({
        panZoomRef,
        workspaceDivRef,
        isSelectBoxKeyDownRef,
        setPan,
        setZoom,
      }),
    [panZoomRef, workspaceDivRef, isSelectBoxKeyDownRef, setPan, setZoom]
  );

  const handleMouseDown = useCallback(
    (event) => {
      if (event.target === workspaceDivRef.current) {
        dragManager.dragData = {type: "panzoom"};
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

  useEffect(() => setWorkspace(workspace), [workspace, setWorkspace]);

  useEffect(() => {
    graphManager.workspace = workspace;
    dragManager.workspace = workspace;
  }, [graphManager, workspace]);

  useEffect(() => {
    function handleKeyUp(event) {
      bridge.onKeyPress(event, event.key, graphManager);
    }

    document.addEventListener("keyup", handleKeyUp);
    return () => document.removeEventListener("keyup", handleKeyUp);
  }, [bridge, workspace, graphManager]);

  useEffect(() => {
    function handleKeyDown({key}) {
      if (key === selectBoxKey) isSelectBoxKeyDownRef.current = true;
    }
    function handleKeyUp({key}) {
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
    <WorkspaceProvider value={workspace}>
      <div
        ref={handleRef}
        className={styles.Workspace}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
      >
        <Canvas transform={transform} />
      </div>
    </WorkspaceProvider>
  );
}

export {Workspace};
