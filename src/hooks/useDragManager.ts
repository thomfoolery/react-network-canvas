import { useContext } from "react";

import { DragManagerContext } from "@component/contexts";
import * as Types from "@component/types";

function useDragManager(): Types.DragManager {
  return useContext(DragManagerContext);
}

export { useDragManager };
