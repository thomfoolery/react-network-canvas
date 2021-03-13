import React, {
  createContext,
  useRef,
  useMemo,
  useContext,
  ReactNode,
} from "react";
import {createPublisher} from "@component/utils";
import * as Types from "@component/types";

const Context = createContext();

interface DragManagerPrivateProps {
  dragData: any;
  dragDelta: Types.Position;
  dragStartPosition: Types.Position | null;
  workspace?: Types.Workspace;
  subscriptions: {
    dragStartById: Publisher;
    dragMoveById: Publisher;
    dragEndById: Publisher;
  };
}

function createDragManager() {
  const __: DragManagerPrivateProps = {
    dragData: null,
    dragDelta: {x: 0, y: 0},
    dragStartPosition: null,
    workspace: undefined,
    subscriptions: {
      dragStartById: createPublisher(),
      dragMoveById: createPublisher(),
      dragEndById: createPublisher(),
    },
  };

  function handleDragStart(event) {
    document.addEventListener("selectstart", handleOnSelectStart);
    event.currentTarget.addEventListener("mousemove", handleDragMove);
    __.dragStartPosition = {x: event.screenX, y: event.screenY};
    __.dragDelta = {x: 0, y: 0};
    __.subscriptions.dragStartById.notifyAll(event);
  }

  function handleDragMove(event) {
    if (!__.dragStartPosition) return;

    const {workspace, dragStartPosition} = __;
    const currentPosition = {x: event.screenX, y: event.screenY};
    const dragDelta = {
      x:
        (currentPosition.x - dragStartPosition.x) /
        (workspace?.panZoom.zoom || 1),
      y:
        (currentPosition.y - dragStartPosition.y) /
        (workspace?.panZoom.zoom || 1),
    };
    __.dragDelta = dragDelta;
    __.subscriptions.dragMoveById.notifyAll(event, dragDelta, __.dragData);
  }

  function handleDragEnd(event) {
    document.removeEventListener("selectstart", handleOnSelectStart);
    event.currentTarget.removeEventListener("mousemove", handleDragMove);
    if (__.dragStartPosition) {
      const {workspace, dragStartPosition} = __;
      const currentPosition = {x: event.screenX, y: event.screenY};
      const dragDelta = {
        x:
          (currentPosition.x - dragStartPosition.x) /
          (workspace?.panZoom.zoom || 1),
        y:
          (currentPosition.y - dragStartPosition.y) /
          (workspace?.panZoom.zoom || 1),
      };
      __.subscriptions.dragEndById.notifyAll(event, dragDelta, __.dragData);
    }
    __.dragStartPosition = null;
    __.dragData = null;
  }

  return {
    set workspace(workspace: Types.Workspace) {
      __.workspace = workspace;
    },
    get dragDelta() {
      return {...__.dragDelta};
    },
    get dragData() {
      return {...__.dragData};
    },
    set dragData(dragData: any) {
      __.dragData = dragData;
    },

    // event handlers
    handleDragStart,
    handleDragMove,
    handleDragEnd,

    // subscriptions
    subscribeToDragStart(id, fn) {
      __.subscriptions.dragStartById.addListenerForId(id, fn);
    },
    unsubscribeToDragStart(id, fn) {
      __.subscriptions.dragStartById.removeListenerForId(id, fn);
    },
    subscribeToDragMove(id, fn) {
      __.subscriptions.dragMoveById.addListenerForId(id, fn);
    },
    unsubscribeToDragMove(id, fn) {
      __.subscriptions.dragMoveById.removeListenerForId(id, fn);
    },
    subscribeToDragEnd(id, fn) {
      __.subscriptions.dragEndById.addListenerForId(id, fn);
    },
    unsubscribeToDragEnd(id, fn) {
      __.subscriptions.dragEndById.removeListenerForId(id, fn);
    },
  };
}

function handleOnSelectStart() {
  return false;
}

interface Props {
  children?: ReactNode;
}

export function DragManagerProvider(props: Props) {
  const dragManager = useMemo(() => createDragManager(), []);
  const containerRef = useRef();
  const {children} = props;
  const style = {
    width: `100%`,
    height: `100%`,
  };

  return (
    <Context.Provider value={dragManager}>
      <div
        ref={containerRef}
        style={style}
        onMouseUp={dragManager.handleDragEnd}
        onMouseLeave={dragManager.handleDragEnd}
        onMouseDown={dragManager.handleDragStart}
      >
        {children}
      </div>
    </Context.Provider>
  );
}

export function useDragManager() {
  return useContext(Context);
}
