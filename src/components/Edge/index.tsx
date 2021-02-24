import React from "react";
import * as Types from "@app/types";

import styles from "./styles.module.css";

interface Props {
  edge: Types.Edge;
}

function Edge(props: Props) {
  const {edge} = props;

  return (
    <g>
      <path id={`Edge-${edge.id}`} className={styles.Edge} />
    </g>
  );
}

export default Edge;
