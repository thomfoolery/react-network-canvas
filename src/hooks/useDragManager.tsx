import React, {createContext, useRef, useMemo, useContext} from "react";
import {Publisher} from "@app/utils";
import * as Types from "@app/types";

const Context = createContext();

interface DragManagerProps {
  domElement: HTMLDivElement | null;
  dragDelta: Types.Position;
  dragStartPosition: Types.Position | null;
  subscriptions: {
    dragStartById: any;
    dragMoveById: any;
    dragEndById: any;
  };
}

class DragManager {
  _private: DragManagerProps = {
    domElement: null,
    dragDelta: {x: 0, y: 0},
    dragStartPosition: null,
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

  get dragDelta() {
    return {...this._private.dragDelta};
  }

  // event handlers
  handleDragStart(event) {
    event.currentTarget.addEventListener("mousemove", this.handleDragMove);
    this._private.dragStartPosition = {x: event.screenX, y: event.screenY};
    this._private.subscriptions.dragStartById.notifyAll(event);
  }
  handleDragMove(event) {
    if (!this._private.dragStartPosition) return;

    const {dragStartPosition} = this._private;
    const currentPosition = {x: event.screenX, y: event.screenY};
    const dragDelta = {
      x: currentPosition.x - dragStartPosition.x,
      y: currentPosition.y - dragStartPosition.y,
    };

    this._private.dragDelta = dragDelta;
    this._private.subscriptions.dragMoveById.notifyAll(event, dragDelta);
  }
  handleDragEnd(event) {
    event.currentTarget.removeEventListener("mousemove", this.handleDragMove);

    if (!this._private.dragStartPosition) return;

    const {dragStartPosition} = this._private;
    const currentPosition = {x: event.screenX, y: event.screenY};
    const dragDelta = {
      x: currentPosition.x - dragStartPosition.x,
      y: currentPosition.y - dragStartPosition.y,
    };

    this._private.subscriptions.dragEndById.notifyAll(event, dragDelta);
    this._private.dragStartPosition = null;
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

export function DragManagerProvider({children}) {
  const dragManager = useMemo(() => new DragManager(), []);
  const containerRef = useRef();

  return (
    <Context.Provider value={dragManager}>
      <div
        ref={containerRef}
        onMouseUp={dragManager.handleDragEnd}
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
