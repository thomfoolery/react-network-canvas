interface PanZoom {
  isInitialized: boolean;
  transform: string;
  setContainer(container: HTMLElement): void;
  panZoomRef: {
    current: {
      x: number;
      y: number;
      zoom: number;
    };
  };
  setZoom(): void;
  setPan(): void;
}

export { PanZoom };
