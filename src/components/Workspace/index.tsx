import React from "react";
import Canvas from "../Canvas";

import styles from "./styles.module.css";

interface Props {}

function Workspace(props: Props) {
  return (
    <div className={styles.Workspace}>
      <Canvas />
    </div>
  );
}

export default Workspace;
