import React, {RefObject, SyntheticEvent} from "react";
import * as Types from "@app/types";

import {Nodes, Edges} from "./components";

import styles from "./styles.module.css";

interface Props {
  onClick?(event: SyntheticEvent, position: Types.Position): void;
}

function Canvas(props: Props) {
  const {onClick = () => null} = props;

  return (
    <div className={styles.Canvas} onClick={onClick}>
      <Edges />
      <Nodes />
    </div>
  );
}

export default Canvas;
