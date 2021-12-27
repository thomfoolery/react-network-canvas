import React from "react";

import styles from "./styles.module.css";

function Modal({ children, onClose }) {
  return (
    <div className={styles.ModalContainer} onClick={onClose}>
      <div className={styles.Modal}>{children}</div>
    </div>
  );
}

export { Modal };
