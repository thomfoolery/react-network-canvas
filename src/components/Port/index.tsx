import React from "react";
import * as Types from "@app/types";

import styles from "./styles.module.css";

interface Props {
  port: Types.Port;
}

function Port(props: Props) {
  const {port} = props;

  return <div id={`Port-${port.id}`} className={styles.Port}></div>;
}

export default Port;
