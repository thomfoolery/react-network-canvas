import {Position} from "./Position";

interface Workspace {
  container: HTMLDivElement;
  isShiftKeyDown: boolean;
  getCanvasPosition(object: any): Position;
  mountContextScreenOffset: Position;
  panZoom: Position;
}

export {Workspace};
