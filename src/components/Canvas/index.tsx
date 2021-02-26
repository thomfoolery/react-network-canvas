import React, {SyntheticEvent} from "react";
import * as Types from "./components/Background/node_modules/@app/types";

import {Background, Foreground} from "./components";

import styles from "./styles.module.css";

interface Props {
  onClick?(event: SyntheticEvent, position: Types.Position): void;
}

function Canvas(props: Props) {
  const {onClick = () => null} = props;

  return (
    <div className={styles.Canvas} onClick={onClick}>
      <Background />
      <Foreground />
    </div>
  );
}

export default Canvas;
