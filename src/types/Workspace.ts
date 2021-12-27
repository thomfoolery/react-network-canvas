import { Position } from "./Position";

interface Workspace {
  setPan(position: Position | ((position: Position) => Position)): void;
  setZoom(zoom: number | ((zoom: number) => number)): void;
  container?: HTMLDivElement;
  isSelectBoxKeyDown: boolean;
  getElementDimensions(HTMLElement): { width: number; height: number };
  getCanvasPosition(object: HTMLElement | DOMRect | MouseEvent): Position;
  mountContextScreenOffset: Position;
  panZoom: {
    zoom: number;
  } & Position;
}

export { Workspace };
