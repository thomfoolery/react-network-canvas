import * as Types from "@component/types";
import {
  Node as NodeComponent,
  Port as PortComponent,
} from "@component/components";

const DEFAULT_THEME = {
  workspace: {
    backgroundSize: "",
    backgroundImage: "",
    backgroundColor: "#f6f6f6",
  },
  canvas: {
    borderRadius: "5px",
    boxShadow: "0 0 0 1px lightgrey",
    backgroundColor: "white",
    backgroundSize: "var(--NC-grid-size) var(--NC-grid-size)",
    backgroundImage:
      "radial-gradient(lightgray, lightgray 1px, transparent 1px)",
    backgroundPosition: "50% 50%",
  },
  selectbox: {
    backgroundColor: "rgba(100, 148, 237, 0.25)",
    boxShadow: "0 0 0 1px cornflowerblue",
  },
  edge: {
    stroke: "black",
    strokeWidth: "3px",
    hover: {
      stroke: "red",
    },
    draft: {
      stroke: "black",
    },
  },
};

const DEFAULT_OPTIONS: Types.Options = {
  gridSize: 10,
  canvasSize: 2000,
  isSnapToGridEnabled: false,
  startAtCanvasCenter: true,
  canvasMargin: 50,
  initialPanOffset: { x: 50, y: 50 },
  zoomSensitivity: 0.001,
  zoomWheelKey: undefined,
  selectBoxKey: "Shift",
  maxZoom: Infinity,
  minZoom: 0,
  NodeComponent,
  PortComponent,
};

const DEFAULT_CALLBACKS: Types.Callbacks = {
  onMount() {
    return undefined;
  },
  onChangeZoom() {
    return undefined;
  },
  onMutateGraph() {
    return undefined;
  },
  onClickCanvas() {
    return undefined;
  },
  onClickNode() {
    return undefined;
  },
  onClickPort() {
    return undefined;
  },
  onDropCanvas() {
    return undefined;
  },
  onKeyPress() {
    return undefined;
  },
  onChangeSelectedNodeIds() {
    return undefined;
  },
};

export { DEFAULT_THEME, DEFAULT_OPTIONS, DEFAULT_CALLBACKS };
