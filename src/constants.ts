import * as Types from "@component/types";
import {
  Node as NodeComponent,
  Port as PortComponent,
} from "@component/components";

const DRAFT_EDGE_ID = "cc77e2e0-598e-4cb0-813c-516666955e42";

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

export { DRAFT_EDGE_ID, DEFAULT_THEME, DEFAULT_OPTIONS };
