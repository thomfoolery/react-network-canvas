import React, { useMemo, createContext } from "react";
import { createDragManager } from "@component/utils";

const DragManagerContext = createContext();

interface Props {
  children?: React.ReactNode;
}

function DragManagerProvider(props: Props): React.ReactNode {
  const dragManager = useMemo(() => createDragManager(), []);
  const { children } = props;
  const style = {
    width: "100%",
    height: "100%",
  };

  return (
    <DragManagerContext.Provider value={dragManager}>
      <div
        style={style}
        onMouseUp={dragManager.handleDragEnd}
        onMouseLeave={dragManager.handleDragEnd}
        onMouseDown={dragManager.handleDragStart}
      >
        {children}
      </div>
    </DragManagerContext.Provider>
  );
}

export { DragManagerContext, DragManagerProvider };
