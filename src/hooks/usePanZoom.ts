import {useRef, useState, useCallback} from "react";
import {useDragManager} from "@app/hooks";

interface Options {
  canvasSize: number;
  canvasMargin?: number;
  startAtCanvasCenter?: boolean;
}

export function usePanZoom(options: Options) {
  const {canvasSize, canvasMargin = 50, startAtCanvasCenter = true} = options;
  const dragManager = useDragManager();

  const [pan, setPan] = useState({x: 0, y: 0});
  const [zoom, setZoom] = useState(1);

  const containerRef = useRef();
  const panZoomRef = useRef({...pan, zoom});

  const setContainer = useCallback((container) => {
    const minX = (canvasSize - container.offsetWidth) * -1 - canvasMargin;
    const minY = (canvasSize - container.offsetHeight) * -1 - canvasMargin;
    const maxX = canvasMargin;
    const maxY = canvasMargin;

    let dragStartPosition;

    function handleDragStart() {
      dragStartPosition = panZoomRef.current;
    }

    function handleDragMove(event, dragDelta, dragData) {
      if (dragData.type === "panzoom") {
        setPan({
          x: clamp(minX, maxX, dragStartPosition.x + dragDelta.x),
          y: clamp(minY, maxY, dragStartPosition.y + dragDelta.y),
        });
      }
    }

    function onWheel(event) {
      const {deltaX, deltaY} = event;

      event.preventDefault();
      setPan((pan) => ({
        x: clamp(minX, maxX, pan.x - deltaX),
        y: clamp(minY, maxY, pan.y - deltaY),
      }));
    }

    function onGesture(event) {
      event.preventDefault();
    }

    if (container && !containerRef.current) {
      if (startAtCanvasCenter) {
        setPan({
          x: (canvasSize / 2 - container.clientWidth / 2) * -1,
          y: (canvasSize / 2 - container.clientHeight / 2) * -1,
        });
      }
      container.addEventListener("wheel", onWheel);
      container.addEventListener("gesturestart", onGesture);
      container.addEventListener("gesturechange", onGesture);
      container.addEventListener("gestureend", onGesture);

      dragManager.subscribeToDragStart("panZoom", handleDragStart);
      dragManager.subscribeToDragMove("panZoom", handleDragMove);

      containerRef.current = container;
    }
  }, []);

  panZoomRef.current = {...pan, zoom};

  return {
    transform: `translate3d(${pan.x}px,${pan.y}px,0) scale(${zoom})`,
    setContainer,
    panZoomRef,
    setZoom,
    setPan,
  };
}

function clamp(min, max, value) {
  return Math.max(min, Math.min(value, max));
}
