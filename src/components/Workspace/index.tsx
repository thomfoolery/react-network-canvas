import React, {useRef} from "react";
import Canvas from "../Canvas";

import styles from "./styles.module.css";

interface Props {}

function Workspace(props: Props) {
  const workspaceDivRef = useRef();

  return (
    <div ref={workspaceDivRef} className={styles.Workspace}>
      <Canvas workspaceDivRef={workspaceDivRef} />
    </div>
  );
}

export default Workspace;
