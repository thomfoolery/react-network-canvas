import { createWorkspace } from "@component/utils";
import * as Types from "@component/types";

const defaultOptions = {
  panZoomRef: {
    current: {
      x: 0,
      y: 0,
      zoom: 1,
    },
  },
  workspaceDivRef: {
    current: document.createElement("div"),
  },
  isSelectBoxKeyDownRef: {
    current: false,
  },
  setPan() {
    return undefined;
  },
  setZoom() {
    return undefined;
  },
};

function mockUseWorkspace(
  workspace: Types.Workspace = createWorkspace(defaultOptions)
): () => Types.Workspace {
  return () => workspace;
}

export { mockUseWorkspace };
