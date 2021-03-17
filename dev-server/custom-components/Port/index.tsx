import React from "react";
import * as Types from "@component/types";

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

  const classList = [
    styles.Port,
    type === "input" ? styles.Input : styles.Output,
  ];

  return (
    <div className={classList.join(" ")}>
      {type === "input" && (
        <div
          id={`Port-${port.id}`}
          onMouseUp={onMouseUp}
          onMouseDown={onMouseDown}
          className={styles.PortTarget}
        />
      )}
      {port.label && <div className={styles.PortLabel}>{port.label}</div>}
      {type === "output" && (
        <div
          id={`Port-${port.id}`}
          onMouseUp={onMouseUp}
          onMouseDown={onMouseDown}
          className={styles.PortTarget}
        />
      )}
    </div>
  );
}

export {Port};
