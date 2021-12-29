import { useRef, useState, useEffect, useCallback } from "react";
import { useDragManager } from "@component/hooks";
import * as Types from "@component/types";

interface Options {
  minZoom: number;
  maxZoom: number;
  canvasSize: number;
  canvasMargin: number;
  initialPan: Types.Position;
  zoomWheelKey?: "Shift" | "Control" | "Meta" | "Alt";
  zoomSensitivity: number;
  onChangeZoom?(zoom: number): void;
}

function usePanZoom(options: Options): Types.PanZoom {
  const {
    minZoom,
    maxZoom,
    initialPan,
    canvasSize,
    canvasMargin,
    zoomWheelKey,
    zoomSensitivity,
    onChangeZoom = () => undefined,
  } = options;

  const dragManager = useDragManager();

  const [isInitialized, setIsInitialized] = useState(false);
  const [transform, setTransform] = useState({ x: 0, y: 0, zoom: 1 });
  const [container, setContainer] = useState();

  const isZoomKeyDownRef = useRef(false);
  const panZoomRef = useRef({ ...transform });
  const boundaryRef = useRef({
    minX: -Infinity,
    maxX: Infinity,
    minY: -Infinity,
    maxY: Infinity,
  });

  const setPan = useCallback((fnOrValue) => {
    setTransform(({ x, y }) => {
      const newPan =
        typeof fnOrValue === "function"
          ? fnOrValue({ x, y })
          : { x: fnOrValue.x, y: fnOrValue.y };
      return { ...transform, ...newPan };
    });
  }, []);

  const setZoom = useCallback(
    (fnOrValue, possibleCenter) => {
      if (!container) return;

      setTransform((transform) => {
        const { zoom } = transform;
        const newZoom =
          typeof fnOrValue === "function" ? fnOrValue(zoom) : zoom;
        const clampedZoom = clamp(minZoom, maxZoom, newZoom);

        if (clampedZoom === zoom) {
          return transform;
        }

        const { x, y } = transform;
        const center = possibleCenter || {
          x: container.offsetWidth / 2,
          y: container.offsetHeight / 2,
        };

        boundaryRef.current = calculateBoundary(
          container,
          canvasSize,
          canvasMargin,
          clampedZoom
        );

        const { minX, minY, maxX, maxY } = boundaryRef.current;

        requestAnimationFrame(() => onChangeZoom(clampedZoom));

        return {
          x: clamp(
            minX,
            maxX,
            x + ((center.x - x) * (zoom - clampedZoom)) / zoom
          ),
          y: clamp(
            minY,
            maxY,
            y + ((center.y - y) * (zoom - clampedZoom)) / zoom
          ),
          zoom: clampedZoom,
        };
      });

      boundaryRef.current = calculateBoundary(
        container,
        canvasSize,
        canvasMargin,
        panZoomRef.current.zoom
      );
    },
    [container, canvasSize, canvasMargin]
  );

  useEffect(() => {
    if (!container) return;

    let dragStartPosition;

    function handleDragStart() {
      dragStartPosition = panZoomRef.current;
    }

    function handleDragMove(event, dragDelta, dragData) {
      const { minX, minY, maxX, maxY } = boundaryRef.current;

      if (dragData?.source === "panzoom") {
        setTransform((transform) => ({
          ...transform,
          x: clamp(
            minX,
            maxX,
            dragStartPosition.x + dragDelta.x * transform.zoom
          ),
          y: clamp(
            minY,
            maxY,
            dragStartPosition.y + dragDelta.y * transform.zoom
          ),
        }));
      }
    }

    dragManager.subscribeToDragStart("panZoom", handleDragStart);
    dragManager.subscribeToDragMove("panZoom", handleDragMove);

    return () => {
      dragManager.unsubscribeToDragStart("panZoom", handleDragStart);
      dragManager.unsubscribeToDragMove("panZoom", handleDragMove);
    };
  }, [container, canvasSize, canvasMargin, setTransform]);

  useEffect(() => {
    if (!container) return;

    setIsInitialized(false);

    function onWheel(event) {
      event.preventDefault();

      if (dragManager.dragData) {
        return;
      }

      if (isZoomKeyDownRef.current) {
        const { deltaY } = event;
        const position = {
          x: event.clientX,
          y: event.clientY,
        };

        setZoom(
          (zoom) => zoom * Math.pow(1 - zoomSensitivity, deltaY),
          position
        );
      } else {
        const { minX, minY, maxX, maxY } = boundaryRef.current;
        const { deltaX, deltaY } = event;

        setTransform((transform) => ({
          ...transform,
          x: clamp(minX, maxX, transform.x - deltaX),
          y: clamp(minY, maxY, transform.y - deltaY),
        }));
      }
    }

    if (initialPan) {
      const { minX, minY, maxX, maxY } = boundaryRef.current;

      setPan({
        x: clamp(minX, maxX, initialPan.x),
        y: clamp(minY, maxY, initialPan.y),
      });
    }

    container.addEventListener("wheel", onWheel);

    setIsInitialized(true);

    return () => {
      container.removeEventListener("wheel", onWheel);
    };
  }, [container, canvasSize, canvasMargin, dragManager, setZoom, setTransform]);

  useEffect(() => {
    if (!container) return;

    function onGesture(event) {
      event.preventDefault();
    }

    container.addEventListener("gesturestart", onGesture);
    container.addEventListener("gesturechange", onGesture);
    container.addEventListener("gestureend", onGesture);

    return () => {
      container.removeEventListener("gesturestart", onGesture);
      container.removeEventListener("gesturechange", onGesture);
      container.removeEventListener("gestureend", onGesture);
    };
  }, [container]);

  useEffect(() => {
    function handleResizeWindow() {
      boundaryRef.current = calculateBoundary(
        container,
        canvasSize,
        canvasMargin,
        panZoomRef.current.zoom
      );
    }

    window.addEventListener("resize", handleResizeWindow);

    return () => {
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, [container, canvasSize, canvasMargin]);

  useEffect(() => {
    if (zoomWheelKey) {
      function handleKeyDown({ key }) {
        if (key === zoomWheelKey) isZoomKeyDownRef.current = true;
      }
      function handleKeyUp({ key }) {
        if (key === zoomWheelKey) isZoomKeyDownRef.current = false;
      }

      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [isZoomKeyDownRef, zoomWheelKey]);

  panZoomRef.current = { ...transform };

  return {
    isInitialized,
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

export { usePanZoom };
