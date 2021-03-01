import React, {useState} from "react";

import styles from "./styles.module.css";

function ZoomControls(props) {
  const {graphManager} = props;
  const [zoom, setZoom] = useState(1);

  return (
    <div className={styles.ZoomControls}>
      <button
        type="button"
        className={styles.ZoomControlsButton}
        onClick={() =>
          graphManager.workspace.setZoom((zoom) => {
            const newZoom = zoom * 1.2;

            setZoom(newZoom);
            return newZoom;
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
            const newZoom = zoom * 0.8;

            setZoom(newZoom);
            return newZoom;
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
