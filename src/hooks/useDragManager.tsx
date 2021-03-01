import React, {
  createContext,
  useRef,
  useMemo,
  useContext,
  ReactNode,
} from "react";
import {Publisher} from "@app/utils";
import * as Types from "@app/types";

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

class DragManager {
  __: DragManagerPrivateProps = {
    dragData: null,
    dragDelta: {x: 0, y: 0},
    dragStartPosition: null,
    workspace: undefined,
    subscriptions: {
      dragStartById: new Publisher(),
      dragMoveById: new Publisher(),
      dragEndById: new Publisher(),
    },
  };

  constructor() {
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDragMove = this.handleDragMove.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
  }

  set workspace(workspace: Types.Workspace) {
    this.__.workspace = workspace;
  }

  get dragDelta() {
    return {...this.__.dragDelta};
  }

  get dragData() {
    return {...this.__.dragData};
  }

  set dragData(dragData: any) {
    this.__.dragData = dragData;
  }

  // event handlers
  handleDragStart(event) {
    document.addEventListener("selectstart", handleOnSelectStart);
    event.currentTarget.addEventListener("mousemove", this.handleDragMove);
    this.__.dragStartPosition = {x: event.screenX, y: event.screenY};
    this.__.dragDelta = {x: 0, y: 0};
    this.__.subscriptions.dragStartById.notifyAll(event);
  }
  handleDragMove(event) {
    if (!this.__.dragStartPosition) return;

    const {workspace, dragStartPosition} = this.__;
    const currentPosition = {x: event.screenX, y: event.screenY};
    const dragDelta = {
      x:
        (currentPosition.x - dragStartPosition.x) /
        (workspace?.panZoom.zoom || 1),
      y:
        (currentPosition.y - dragStartPosition.y) /
        (workspace?.panZoom.zoom || 1),
    };

    this.__.dragDelta = dragDelta;
    this.__.subscriptions.dragMoveById.notifyAll(
      event,
      dragDelta,
      this.dragData
    );
  }
  handleDragEnd(event) {
    document.removeEventListener("selectstart", handleOnSelectStart);
    event.currentTarget.removeEventListener("mousemove", this.handleDragMove);

    if (this.__.dragStartPosition) {
      const {workspace, dragStartPosition} = this.__;
      const currentPosition = {x: event.screenX, y: event.screenY};
      const dragDelta = {
        x:
          (currentPosition.x - dragStartPosition.x) /
          (workspace?.panZoom.zoom || 1),
        y:
          (currentPosition.y - dragStartPosition.y) /
          (workspace?.panZoom.zoom || 1),
      };

      this.__.subscriptions.dragEndById.notifyAll(
        event,
        dragDelta,
        this.dragData
      );
    }

    this.__.dragStartPosition = null;
    this.__.dragData = null;
  }

  // subscriptions
  subscribeToDragStart(id, fn) {
    this.__.subscriptions.dragStartById.addListenerForId(id, fn);
  }
  unsubscribeToDragStart(id, fn) {
    this.__.subscriptions.dragStartById.removeListenerForId(id, fn);
  }
  subscribeToDragMove(id, fn) {
    this.__.subscriptions.dragMoveById.addListenerForId(id, fn);
  }
  unsubscribeToDragMove(id, fn) {
    this.__.subscriptions.dragMoveById.removeListenerForId(id, fn);
  }
  subscribeToDragEnd(id, fn) {
    this.__.subscriptions.dragEndById.addListenerForId(id, fn);
  }
  unsubscribeToDragEnd(id, fn) {
    this.__.subscriptions.dragEndById.removeListenerForId(id, fn);
  }
}

function handleOnSelectStart() {
  return false;
}

interface Props {
  children?: ReactNode;
}

export function DragManagerProvider(props: Props) {
  const dragManager = useMemo(() => new DragManager(), []);
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
