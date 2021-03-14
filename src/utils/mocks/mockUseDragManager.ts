import {createDragManager} from "@component/hooks/useDragManager";

function mockUseDragManager(dragManager = createDragManager()) {
  return () => dragManager;
}

export {mockUseDragManager};
