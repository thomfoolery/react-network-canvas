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
  _private: DragManagerPrivateProps = {
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
    this._private.workspace = workspace;
  }

  get dragDelta() {
    return {...this._private.dragDelta};
  }

  get dragData() {
    return {...this._private.dragData};
  }

  set dragData(dragData: any) {
    this._private.dragData = dragData;
  }

  // event handlers
  handleDragStart(event) {
    event.currentTarget.addEventListener("mousemove", this.handleDragMove);
    this._private.dragStartPosition = {x: event.screenX, y: event.screenY};
    this._private.dragDelta = {x: 0, y: 0};
    this._private.subscriptions.dragStartById.notifyAll(event);
  }
  handleDragMove(event) {
    if (!this._private.dragStartPosition) return;

    const {workspace, dragStartPosition} = this._private;
    const currentPosition = {x: event.screenX, y: event.screenY};
    const dragDelta = {
      x:
        (currentPosition.x - dragStartPosition.x) /
        (workspace?.panZoom.zoom || 1),
      y:
        (currentPosition.y - dragStartPosition.y) /
        (workspace?.panZoom.zoom || 1),
    };

    this._private.dragDelta = dragDelta;
    this._private.subscriptions.dragMoveById.notifyAll(
      event,
      dragDelta,
      this.dragData
    );
  }
  handleDragEnd(event) {
    event.currentTarget.removeEventListener("mousemove", this.handleDragMove);

    if (this._private.dragStartPosition) {
      const {workspace, dragStartPosition} = this._private;
      const currentPosition = {x: event.screenX, y: event.screenY};
      const dragDelta = {
        x:
          (currentPosition.x - dragStartPosition.x) /
          (workspace?.panZoom.zoom || 1),
        y:
          (currentPosition.y - dragStartPosition.y) /
          (workspace?.panZoom.zoom || 1),
      };

      this._private.subscriptions.dragEndById.notifyAll(
        event,
        dragDelta,
        this.dragData
      );
    }

    this._private.dragStartPosition = null;
    this._private.dragData = null;
  }

  // subscriptions
  subscribeToDragStart(id, fn) {
    this._private.subscriptions.dragStartById.addListenerForId(id, fn);
  }
  unsubscribeToDragStart(id, fn) {
    this._private.subscriptions.dragStartById.removeListenerForId(id, fn);
  }
  subscribeToDragMove(id, fn) {
    this._private.subscriptions.dragMoveById.addListenerForId(id, fn);
  }
  unsubscribeToDragMove(id, fn) {
    this._private.subscriptions.dragMoveById.removeListenerForId(id, fn);
  }
  subscribeToDragEnd(id, fn) {
    this._private.subscriptions.dragEndById.addListenerForId(id, fn);
  }
  unsubscribeToDragEnd(id, fn) {
    this._private.subscriptions.dragEndById.removeListenerForId(id, fn);
  }
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
