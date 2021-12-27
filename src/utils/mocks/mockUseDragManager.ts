import { createDragManager } from "@component/hooks/useDragManager";
import * as Types from "@component/types";

function mockUseDragManager(
  dragManager: Types.DragManager = createDragManager()
): () => Types.DragManager {
  return () => dragManager;
}

export { mockUseDragManager };
