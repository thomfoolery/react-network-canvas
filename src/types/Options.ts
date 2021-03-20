import * as Types from "@component/types";
import {ReactComponent} from "react";

interface Options {
  gridSize: number;
  canvasSize: number;
  isSnapToGridEnabled: boolean;
  startAtCanvasCenter: boolean;
  canvasMargin: number;
  zoomSensitivity: number;
  initialPanOffset: Types.Position;
  selectBoxKey?: "Shift" | "Control" | "Alt" | "Meta";
  zoomWheelKey?: "Shift" | "Control" | "Alt" | "Meta";
  maxZoom: number;
  minZoom: number;
  NodeComponent: ReactComponent;
  PortComponent: ReactComponent;
}

export {Options};
