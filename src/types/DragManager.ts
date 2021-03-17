import {SyntheticEvent} from "react";
import * as Types from "@component/types";

interface DragManager {
  workspace: Types.Workspace;
  dragDelta: Types.Position;
  dragData: any;

  // event handlers
  handleDragStart(event: SyntheticEvent): void;
  handleDragMove(event: SyntheticEvent): void;
  handleDragEnd(event: SyntheticEvent): void;

  // subscriptions
  subscribeToDragStart(id, fn): void;
  unsubscribeToDragStart(id, fn): void;
  subscribeToDragMove(id, fn): void;
  unsubscribeToDragMove(id, fn): void;
  subscribeToDragEnd(id, fn): void;
  unsubscribeToDragEnd(id, fn): void;
}

export {DragManager};
