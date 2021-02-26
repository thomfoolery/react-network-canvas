import React, {useRef} from "react";
import Canvas from "../Canvas";
import {WorkspaceProvider} from "@app/hooks";

import styles from "./styles.module.css";

interface Props {}

function Workspace(props: Props) {
  const workspaceDivRef = useRef();

  return (
    <div ref={workspaceDivRef} className={styles.Workspace}>
      <WorkspaceProvider value={workspaceDivRef}>
        <Canvas workspaceDivRef={workspaceDivRef} />
      </WorkspaceProvider>
    </div>
  );
}

export default Workspace;
