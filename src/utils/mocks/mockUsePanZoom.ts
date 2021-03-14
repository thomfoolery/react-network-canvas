const defaultOptions = {
  transform: `translate3d(0px,0px,0) scale(1)`,
  panZoomRef: {
    current: 1,
  },
  setZoom() {},
  setPan() {},
  setContainer() {},
  setWorkspace() {},
};

function mockUsePanZoom(options = {}) {
  return () => ({...defaultOptions, ...options});
}

export {mockUsePanZoom};
