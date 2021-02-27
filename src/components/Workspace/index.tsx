import React, {useRef, useMemo, useEffect} from "react";
import Canvas from "../Canvas";
import {
  WorkspaceProvider,
  useBridge,
  useDragManager,
  useGraphManager,
} from "@app/hooks";

import styles from "./styles.module.css";

interface Props {}

function Workspace(props: Props) {
  const graphManager = useGraphManager();
  const dragManager = useDragManager();
  const bridge = useBridge();

  const workspaceDivRef = useRef();
  const shiftKeyDownRef = useRef(false);

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
      scrollPosition: {
        get x() {
          return workspaceDivRef.current.scrollLeft;
        },
        get y() {
          return workspaceDivRef.current.scrollTop;
        },
      },
      getCanvasPosition(object) {
        if (object instanceof DOMRect) {
          return {
            x: object.left - this.offset.x + this.scrollPosition.x,
            y: object.top - this.offset.y + this.scrollPosition.y,
          };
        } else {
          return {
            x: object.clientX - this.offset.x + this.scrollPosition.x,
            y: object.clientY - this.offset.y + this.scrollPosition.y,
          };
        }
      },
    };
  }, [workspaceDivRef, shiftKeyDownRef]);

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
    <div ref={workspaceDivRef} className={styles.Workspace}>
      <WorkspaceProvider value={workspace}>
        <Canvas />
      </WorkspaceProvider>
    </div>
  );
}

export default Workspace;
