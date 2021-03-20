import React from "react";

import styles from "./styles.module.css";

function ZoomControls(props) {
  const {zoom, graphManager} = props;

  return (
    <div className={styles.ZoomControls}>
      <button
        type="button"
        className={styles.ZoomControlsButton}
        onClick={() =>
          graphManager.workspace.setZoom((zoom) => {
            return zoom + 0.1;
          })
        }
      >
        +
      </button>
      <button
        type="button"
        className={styles.ZoomControlsButton}
        onClick={() =>
          graphManager.workspace.setZoom((zoom) => {
            return zoom - 0.1;
          })
        }
      >
        –
      </button>
      <span className={styles.ZoomControlsLabel}>
        {(zoom * 100).toFixed(0)}%
      </span>
    </div>
  );
}

export {ZoomControls};
