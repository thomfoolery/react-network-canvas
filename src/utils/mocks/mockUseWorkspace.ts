import {createWorkspace} from "@component/hooks/useWorkspace";

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
  setPan() {},
  setZoom() {},
};

function mockUseWorkspace(workspace = createWorkspace(defaultOptions)) {
  return () => workspace;
}

export {mockUseWorkspace};
