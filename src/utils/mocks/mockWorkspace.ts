import {createWorkspace} from "@component/hooks/useWorkspace";

function mockWorkspace() {
  return createWorkspace({
    panZoomRef: {
      current: {},
    },
    workspaceDivRef: {
      current: document.createElement("div"),
    },
    isSelectBoxKeyDownRef: {
      current: false,
    },
    setPan() {},
    setZoom() {},
  });
}

export {mockWorkspace};
