import {v1 as generateUuid} from "uuid";

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

const DEFAULT_OPTIONS = {
  gridSize: 10,
  canvasSize: 2000,
};

export {DRAFT_EDGE_ID, DEFAULT_THEME, DEFAULT_OPTIONS};
