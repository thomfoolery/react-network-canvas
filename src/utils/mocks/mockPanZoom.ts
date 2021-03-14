function mockPanZoom() {
  return {
    transform: `translate3d(0px,0px,0) scale(1)`,
    setContainer() {},
    setWorkspace() {},
    panZoomRef: {
      current: 1,
    },
    setZoom() {},
    setPan() {},
  };
}

export {mockPanZoom};
