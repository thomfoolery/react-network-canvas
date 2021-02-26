import React, {useRef, useMemo, useEffect} from "react";
import Canvas from "../Canvas";
import {WorkspaceProvider, useDragManager, useGraphManager} from "@app/hooks";

import styles from "./styles.module.css";

interface Props {}

function Workspace(props: Props) {
  const workspaceDivRef = useRef();
  const dragManager = useDragManager();
  const graphManager = useGraphManager();

  const workspace = useMemo(() => {
    return {
      get container() {
        return workspaceDivRef.current;
      },
      scrollPosition: {
        get left() {
          return workspaceDivRef.current.scrollLeft;
        },
        get top() {
          return workspaceDivRef.current.scrollTop;
        },
      },
    };
  }, [workspaceDivRef]);

  useEffect(() => {
    graphManager.dragManager = dragManager;
    graphManager.workspace = workspace;
  }, [graphManager, dragManager, workspaceDivRef]);

  return (
    <div ref={workspaceDivRef} className={styles.Workspace}>
      <WorkspaceProvider value={workspace}>
        <Canvas />
      </WorkspaceProvider>
    </div>
  );
}

export default Workspace;
