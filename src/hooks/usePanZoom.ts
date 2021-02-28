import {useRef, useState, useEffect, useCallback} from "react";
import {useDragManager} from "@app/hooks";

interface Options {
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
  minZoom?: number;
  maxZoom?: number;
  container?: HTMLDivElement;
}

const defaultOptions = {};

export function usePanZoom(options: Options = defaultOptions) {
  const {
    minX = -Infinity,
    maxX = Infinity,
    minY = -Infinity,
    maxY = Infinity,
    minZoom = 0,
    maxZoom = Infinity,
  } = options;

  const dragManager = useDragManager();

  const [pan, setPan] = useState({x: 0, y: 0});
  const [zoom, setZoom] = useState(1);

  const containerRef = useRef();
  const panZoomRef = useRef({...pan, zoom});

  const clampX = useCallback(clamp(minX, maxX), [minX, maxX]);
  const clampY = useCallback(clamp(minY, maxY), [minY, maxY]);
  const clampZoom = useCallback(clamp(minZoom, maxZoom), [minZoom, maxZoom]);

  const setContainer = useCallback((container) => {
    let startPosition;

    function handleDragStart() {
      startPosition = panZoomRef.current;
    }

    function handleDragMove(event, dragDelta, dragData) {
      if (dragData.type === "panzoom") {
        setPan({
          x: clampX(startPosition.x + dragDelta.x),
          y: clampY(startPosition.y + dragDelta.y),
        });
      }
    }

    function onWheel(event) {
      const {deltaX, deltaY} = event;

      event.preventDefault();
      setPan((pan) => ({
        x: clampX(pan.x - deltaX),
        y: clampY(pan.y - deltaY),
      }));
    }

    function onGesture(event) {
      event.preventDefault();
    }

    if (container && !containerRef.current) {
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

function clamp(min, max) {
  return (value) => Math.max(min, Math.min(value, max));
}
