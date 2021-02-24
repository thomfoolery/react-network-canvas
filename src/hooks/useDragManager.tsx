import React, {createContext, useRef, useMemo, useContext} from "react";
// import {Publisher} from "@app/utils";
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
      dragStartById: new Map(),
      dragMoveById: new Map(),
      dragEndById: new Map(),
    },
  };

  constructor() {
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDragMove = this.handleDragMove.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
  }

  // event handlers
  handleDragStart(event) {
    event.currentTarget.addEventListener("mousemove", this.handleDragMove);
    this._private.dragStartPosition = {x: event.screenX, y: event.screenY};
    this._private.subscriptions.dragStartById.forEach((fns) =>
      fns.forEach((fn) => fn(event))
    );
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
    this._private.subscriptions.dragMoveById.forEach((fns) =>
      fns.forEach((fn) => fn(event, dragDelta))
    );
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

    this._private.subscriptions.dragEndById.forEach((fns) =>
      fns.forEach((fn) => fn(event, dragDelta))
    );
    this._private.dragStartPosition = null;
  }

  // subscriptions
  subscribeToDragStart(id, fn) {
    this.registerSubscriptionById("dragStartById", id, fn);
  }
  unsubscribeToDragStart(id, fn) {
    this.unregisterSubscriptionById("dragStartById", id, fn);
  }
  subscribeToDragMove(id, fn) {
    this.registerSubscriptionById("dragMoveById", id, fn);
  }
  unsubscribeToDragMove(id, fn) {
    this.unregisterSubscriptionById("dragMoveById", id, fn);
  }
  subscribeToDragEnd(id, fn) {
    this.registerSubscriptionById("dragEndById", id, fn);
  }
  unsubscribeToDragEnd(id, fn) {
    this.unregisterSubscriptionById("dragEndById", id, fn);
  }
  registerSubscriptionById(registryId, id, fn) {
    const registry = this._private.subscriptions[registryId];
    const subscriptions = registry.has(id) ? registry.get(id) : [];

    registry.set(id, [...subscriptions, fn]);
  }
  unregisterSubscriptionById(registryId, id, fn) {
    const registry = this._private.subscriptions[registryId];

    if (registry.has(id)) {
      const value = registry.get(id).filter((f) => f !== fn);

      registry.set(id, value);
    }
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
