import React from "react";
import Node from "../Node";
import Edge from "../Edge";
import {useGraphManager} from "../../hooks/useGraphManager";

import styles from "./styles.module.css";

interface Props {}

function Canvas(props: Props) {
  const {nodes, edges} = useGraphManager();

  return (
    <div className={styles.Canvas}>
      <svg className={styles.CanvasEdges} xmlns="http://www.w3.org/2000/svg">
        {edges.map((edge) => (
          <Edge key={edge.id} edge={edge} />
        ))}
      </svg>
      <div className={styles.CanvasNodes}>
        {nodes.map((node) => (
          <Node key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}

export default Canvas;
