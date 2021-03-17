import {ReactComponent} from "react";

interface Options {
  gridSize: number;
  canvasSize: number;
  isSnapToGridEnabled: boolean;
  startAtCanvasCenter: boolean;
  canvasMargin: number;
  zoomSensitivity: number;
  selectBoxKey?: "Shift" | "Control" | "Alt" | "Meta";
  zoomWheelKey?: "Shift" | "Control" | "Alt" | "Meta";
  maxZoom: number;
  minZoom: number;
  NodeComponent: ReactComponent;
  PortComponent: ReactComponent;
}

export {Options};
