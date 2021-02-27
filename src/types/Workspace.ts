import {Position} from "./Position";

interface Workspace {
  container: HTMLDivElement;
  isShiftKeyDown: boolean;
  getCanvasPosition(object: any): Position;
  offset: Position;
  scrollPosition: Position;
}

export {Workspace};
