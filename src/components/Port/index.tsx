import React from "react";
import * as Types from "@component/types";
import {joinClassList} from "@component/utils";

import styles from "./styles.module.css";

interface Props {
  node: Types.Node;
  port: Types.Port;
  type: "input" | "output";
  onMouseUp(): void;
  onMouseDown(): void;
}

function Port(props: Props) {
  const {port, type, onMouseUp, onMouseDown} = props;

  const className = joinClassList(
    styles.Port,
    type === "input" ? styles.Input : styles.Output
  );

  return (
    <div
      id={`Port-${port.id}`}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      className={className}
      data-testid={`${port.id}`}
    ></div>
  );
}

export {Port};
