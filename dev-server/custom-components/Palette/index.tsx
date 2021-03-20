import React, {useCallback, ReactNode} from "react";

import styles from "./styles.module.css";

function Palette(): ReactNode {
  const handleDragStart = useCallback(
    (type) => (event) => {
      event.dataTransfer.setData("text/plain", type);
    },
    []
  );

  return (
    <div className={styles.Palette}>
      <div draggable onDragStart={handleDragStart("SRC")}>
        SRC
      </div>
      <div draggable onDragStart={handleDragStart("OSC")}>
        OSC
      </div>
      <div draggable onDragStart={handleDragStart("LFO")}>
        LFO
      </div>
      <div draggable onDragStart={handleDragStart("GAIN")}>
        GAIN
      </div>
      <div draggable onDragStart={handleDragStart("ASDR")}>
        ASDR
      </div>
      <div draggable onDragStart={handleDragStart("NOISE")}>
        NOISE
      </div>
      <div draggable onDragStart={handleDragStart("FILTER")}>
        FILTER
      </div>
      <div draggable onDragStart={handleDragStart("DEST")}>
        DEST
      </div>
    </div>
  );
}

export {Palette};
