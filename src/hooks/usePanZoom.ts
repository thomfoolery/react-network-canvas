import {useRef, useState, useEffect, useCallback} from "react";
import {useDragManager} from "@app/hooks";

interface Options {
  canvasSize: number;
  canvasMargin: number;
  startAtCanvasCenter: boolean;
}

export function usePanZoom(options: Options) {
  const {canvasSize, canvasMargin, startAtCanvasCenter} = options;
  const dragManager = useDragManager();

  const [transform, setTransform] = useState({x: 0, y: 0, zoom: 1});
  const [container, setContainer] = useState();

  const panZoomRef = useRef({...transform});
  const boundaryRef = useRef({
    minX: -Infinity,
    maxX: Infinity,
    minY: -Infinity,
    maxY: Infinity,
  });

  const setPan = useCallback((pan) => {
    setTransform(({x, y}) => {
      const newPan = typeof pan === "function" ? pan({x, y}) : {x, y};
      return {...transform, ...newPan};
    });
  }, []);

  const setZoom = useCallback(
    (...arg) => {
      setTransform(({x, y, zoom}) => {
        const newZoom = typeof arg[0] === "function" ? arg[0](zoom) : zoom;

        const center = {
          x: container.offsetWidth / 2,
          y: container.offsetHeight / 2,
        };

        boundaryRef.current = calculateBoundary(
          container,
          canvasSize,
          canvasMargin,
          newZoom
        );

        let {minX, minY, maxX, maxY} = boundaryRef.current;

        return {
          x: clamp(minX, maxX, x + ((center.x - x) * (zoom - newZoom)) / zoom),
          y: clamp(minY, maxY, y + ((center.y - y) * (zoom - newZoom)) / zoom),
          zoom: newZoom,
        };
      });
    },
    [container, canvasSize, canvasMargin]
  );

  useEffect(() => {
    if (container) {
      boundaryRef.current = calculateBoundary(
        container,
        canvasSize,
        canvasMargin,
        panZoomRef.current.zoom
      );

      let dragStartPosition;

      function handleDragStart() {
        dragStartPosition = panZoomRef.current;
      }

      function handleDragMove(event, dragDelta, dragData) {
        const {minX, minY, maxX, maxY} = boundaryRef.current;

        if (dragData.type === "panzoom") {
          setTransform((tranform) => ({
            ...tranform,
            x: clamp(minX, maxX, dragStartPosition.x + dragDelta.x),
            y: clamp(minY, maxY, dragStartPosition.y + dragDelta.y),
          }));
        }
      }

      function onWheel(event) {
        const {minX, minY, maxX, maxY} = boundaryRef.current;
        const {deltaX, deltaY} = event;

        event.preventDefault();
        setTransform((tranform) => ({
          ...tranform,
          x: clamp(minX, maxX, tranform.x - deltaX),
          y: clamp(minY, maxY, tranform.y - deltaY),
        }));
      }

      function onGesture(event) {
        event.preventDefault();
      }

      function handleResizeWindow() {
        boundaryRef.current = calculateBoundary(
          container,
          canvasSize,
          canvasMargin,
          panZoomRef.current.zoom
        );
      }

      if (startAtCanvasCenter) {
        setTransform((tranform) => ({
          ...tranform,
          x: (canvasSize / 2 - container.clientWidth / 2) * -1,
          y: (canvasSize / 2 - container.clientHeight / 2) * -1,
        }));
      }

      container.addEventListener("wheel", onWheel);
      container.addEventListener("gesturestart", onGesture);
      container.addEventListener("gesturechange", onGesture);
      container.addEventListener("gestureend", onGesture);

      window.addEventListener("resize", handleResizeWindow);

      dragManager.subscribeToDragStart("panZoom", handleDragStart);
      dragManager.subscribeToDragMove("panZoom", handleDragMove);

      return () => {
        container.removeEventListener("wheel", onWheel);
        container.removeEventListener("gesturestart", onGesture);
        container.removeEventListener("gesturechange", onGesture);
        container.removeEventListener("gestureend", onGesture);

        window.removeEventListener("resize", handleResizeWindow);

        dragManager.unsubscribeToDragStart("panZoom", handleDragStart);
        dragManager.unsubscribeToDragMove("panZoom", handleDragMove);
      };
    }
  }, [container, canvasSize, canvasMargin]);

  panZoomRef.current = {...transform};

  return {
    transform: `translate3d(${transform.x}px,${transform.y}px,0) scale(${transform.zoom})`,
    setContainer,
    panZoomRef,
    setZoom,
    setPan,
  };
}

function calculateBoundary(container, canvasSize, canvasMargin, zoom = 1) {
  const adjustedMargin = canvasMargin * zoom;
  const adjustedCanvas = canvasSize * zoom;

  let minX = (adjustedCanvas - container.offsetWidth) * -1 - adjustedMargin;
  let minY = (adjustedCanvas - container.offsetHeight) * -1 - adjustedMargin;
  let maxX = adjustedMargin;
  let maxY = adjustedMargin;

  if (minX > maxX) {
    minX = maxX = (container.offsetWidth - adjustedCanvas) / 2;
  }
  if (minY > maxY) {
    minY = maxY = (container.offsetHeight - adjustedCanvas) / 2;
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
  };
}

function clamp(min, max, value) {
  return Math.max(min, Math.min(value, max));
}
