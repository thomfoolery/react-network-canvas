import {Position} from "./Position";

interface Workspace {
  container: HTMLDivElement;
  isSelectBoxKeyDown: boolean;
  getCanvasPosition(object: any): Position;
  mountContextScreenOffset: Position;
  panZoom: {
    zoom: number;
  } & Position;
}

export {Workspace};
