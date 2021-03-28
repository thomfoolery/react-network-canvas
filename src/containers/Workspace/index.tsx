import React, {useRef, useMemo, useEffect, useCallback, ReactNode} from "react";
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

function Workspace(): ReactNode {
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

  const initialPan = useMemo(() => {
    const {nodes} = graphManager;
    const {
      initialPanOffset = {
        x: canvasMargin,
        y: canvasMargin,
      },
    } = options;

    return nodes.length > 0
      ? ((position) => {
          return {
            x: position.x * -1 + initialPanOffset.x,
            y: position.y * -1 + initialPanOffset.y,
          };
        })(
          nodes.reduce(
            (acc, node) => {
              const x = node.position.x < acc.x ? node.position.x : acc.x;
              const y = node.position.y < acc.y ? node.position.y : acc.y;

              return {x, y};
            },
            {x: Infinity, y: Infinity}
          )
        )
      : null;
  }, []);

  const onChangeZoom = useCallback((zoom) => bridge.onChangeZoom(zoom), [
    bridge,
  ]);

  const {setPan, setZoom, transform, panZoomRef, setContainer} = usePanZoom({
    minZoom,
    maxZoom,
    initialPan,
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
    [graphManager, workspaceDivRef, setPan, setContainer]
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
      bridge.onDropCanvas(event, position, graphManager);
    },
    [bridge, workspace, graphManager]
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

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
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
      >
        <Canvas transform={transform} />
      </div>
    </WorkspaceProvider>
  );
}

export {Workspace};
