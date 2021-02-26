import React, {RefObject, SyntheticEvent} from "react";
import * as Types from "@app/types";

import {Nodes, Edges} from "./components";

import styles from "./styles.module.css";

interface Props {
  onClick?(event: SyntheticEvent, position: Types.Position): void;
  workspaceDivRef: RefObject<HTMLDivElement>;
}

function Canvas(props: Props) {
  const {onClick = () => null, workspaceDivRef} = props;

  return (
    <div className={styles.Canvas} onClick={onClick}>
      <Edges workspaceDivRef={workspaceDivRef} />
      <Nodes />
    </div>
  );
}

export default Canvas;
