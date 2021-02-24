import React, {createContext, useMemo, useContext, useEffect} from "react";
import {useDragManager} from "./useDragManager";
import {Publisher} from "@app/utils";
import * as Types from "@app/types";

const Context = createContext();

function getObjectsByIdMap(objects) {
  return objects.reduce((acc, object) => {
    acc[object.id] = object;
    return acc;
  }, {});
}

function getEdgesByNodeIdMap(edges) {
  return edges.reduce((acc, edge) => {
    const {from, to} = edge;

    if (acc[from.nodeId]) {
      acc[from.nodeId].push(edge);
    } else {
      acc[from.nodeId] = [edge];
    }

    if (acc[to.nodeId]) {
      acc[to.nodeId].push(edge);
    } else {
      acc[to.nodeId] = [edge];
    }

    return acc;
  }, {});
}

interface GraphManagerProps {
  nodes: Types.Node[];
  edges: Types.Edge[];
  nodesByIdMap: {[id: string]: Types.Node};
  edgesByIdMap: {[id: string]: Types.Edge};
  edgesByNodeIdMap: {[id: string]: Types.Edge[]};
  selectedNodeIds: string[];
  dragDelta: Types.Position;
  subscriptions: {
    nodePositionChangeById: Publisher;
    isSelectedById: Publisher;
    dragDeltaById: Publisher;
  };
}

class GraphManager {
  _private: GraphManagerProps = {
    nodes: [],
    edges: [],
    nodesByIdMap: {},
    edgesByIdMap: {},
    edgesByNodeIdMap: {},
    selectedNodeIds: [],
    dragDelta: {x: 0, y: 0},
    subscriptions: {
      nodePositionChangeById: new Publisher(),
      isSelectedById: new Publisher(),
      dragDeltaById: new Publisher(),
    },
  };

  constructor({nodes = [], edges = []}) {
    this.nodes = nodes;
    this.edges = edges;
  }

  // nodes
  get nodes() {
    return [...this._private.nodes];
  }
  set nodes(nodes) {
    this._private.nodes = nodes;
    this._private.nodesByIdMap = getObjectsByIdMap(nodes);
  }
  getNodeById(id): Types.Node {
    return {...this._private.nodesByIdMap[id]};
  }
  getNodesByEdgeId(id: string): {from?: Types.Node; to?: Types.Node} {
    const edge: Types.Edge = this._private.edgesByIdMap[id];
    if (edge) {
      const from = this._private.nodesByIdMap[edge.from.nodeId];
      const to = this._private.nodesByIdMap[edge.to.nodeId];
      return {from, to};
    }
    return {from: undefined, to: undefined};
  }
  // position
  handleDragDelta(dragDelta) {
    const {selectedNodeIds} = this._private;
    this._private.subscriptions.dragDeltaById.notifyIds(
      selectedNodeIds,
      dragDelta
    );
  }
  handleDragEnd(dragDelta) {
    const {selectedNodeIds} = this._private;
    this._private.subscriptions.dragDeltaById.notifyIds(selectedNodeIds, {
      x: 0,
      y: 0,
    });
    selectedNodeIds.forEach((id) => this.updateNodePositionById(id, dragDelta));
  }
  updateNodePositionById(id, dragDelta) {
    const node = this._private.nodesByIdMap[id];
    const position = {
      x: node.position.x + dragDelta.x,
      y: node.position.y + dragDelta.y,
    };

    node.position = position;
    this._private.subscriptions.nodePositionChangeById.notifyIds(
      [id],
      position
    );
  }
  subscribeToDragDeltaById(id, fn) {
    this._private.subscriptions.dragDeltaById.addListener(id, fn);
  }
  unsubscribeToDragDeltaById(id, fn) {
    this._private.subscriptions.dragDeltaById.removeListener(id, fn);
  }
  subscribeToNodePositionChangeById(id, fn) {
    this._private.subscriptions.nodePositionChangeById.addListener(id, fn);
  }
  unsubscribeToNodePositionChangeById(id, fn) {
    this._private.subscriptions.nodePositionChangeById.addListener(id, fn);
  }
  // selected ids
  get selectedNodeIds(): string[] {
    return [...this._private.selectedNodeIds];
  }
  set selectedNodeIds(selectedNodeIds: string[]) {
    const unselectedNodeIds = this._private.selectedNodeIds.filter(
      (id) => !selectedNodeIds.includes(id)
    );
    const newSelectedNodeIds = selectedNodeIds.filter(
      (id) => !this._private.selectedNodeIds.includes(id)
    );

    this._private.selectedNodeIds = [...selectedNodeIds];
    this._private.subscriptions.isSelectedById.notifyIds(selectedNodeIds, true);
    this._private.subscriptions.isSelectedById.notifyIds(
      unselectedNodeIds,
      false
    );
  }
  appendSelectedNodeIds(appendedNodeIds: string[]) {
    const selectedNodeIds = Array.from(
      new Set([...this._private.selectedNodeIds, ...appendedNodeIds])
    );

    this._private.subscriptions.isSelectedById.notifyIds(selectedNodeIds, true);
  }
  removeSelectedNodeIds(unselectedNodeIds: string[]) {
    const selectedNodeIds = this._private.selectedNodeIds.filter(
      (id) => !unselectedNodeIds.includes(id)
    );

    this._private.selectedNodeIds = selectedNodeIds;
    this._private.subscriptions.isSelectedById.notifyIds(
      unselectedNodeIds,
      false
    );
  }
  clearSelectedNodeIds(): void {
    const {selectedNodeIds} = this._private;

    this._private.selectedNodeIds = [];
    this._private.subscriptions.isSelectedById.notifyIds(
      selectedNodeIds,
      false
    );
  }
  subscribeToIsSelectedById(id, fn) {
    this._private.subscriptions.isSelectedById.addListener(id, fn);
  }
  unsubscribeToIsSelectedById(id, fn) {
    this._private.subscriptions.isSelectedById.removeListener(id, fn);
  }
  // edges
  get edges() {
    return [...this._private.edges];
  }
  set edges(edges: Types.Edge[]) {
    this._private.edges = edges;
    this._private.edgesByIdMap = getObjectsByIdMap(edges);
    this._private.edgesByNodeIdMap = getEdgesByNodeIdMap(edges);
  }
  getEdgeById(id: string): Types.Edge {
    return {...this._private.edgesByIdMap[id]};
  }
  getEdgesByNodeId(id: string): Types.Edge[] {
    return this._private.edgesByNodeIdMap[id]
      ? [...this._private.edgesByNodeIdMap[id]]
      : [];
  }
}

export function GraphManagerProvider({nodes, edges, children}) {
  const dragManager = useDragManager();
  const graphManager = useMemo(() => new GraphManager({nodes, edges}), []);

  useEffect(() => {
    function handleDragStart() {
      console.log("dragStart");
    }
    function handleDragMove(_, dragDelta) {
      graphManager.handleDragDelta(dragDelta);
    }
    function handleDragEnd(_, dragDelta) {
      graphManager.handleDragEnd(dragDelta);
    }

    dragManager.subscribeToDragStart("graphManager", handleDragStart);
    dragManager.subscribeToDragMove("graphManager", handleDragMove);
    dragManager.subscribeToDragEnd("graphManager", handleDragEnd);

    return () => {
      dragManager.unsubscribeToDragStart("graphManager", handleDragStart);
      dragManager.unsubscribeToDragMove("graphManager", handleDragMove);
      dragManager.unsubscribeToDragEnd("graphManager", handleDragEnd);
    };
  }, [dragManager]);

  return <Context.Provider value={graphManager}>{children}</Context.Provider>;
}

export function useGraphManager() {
  return useContext(Context);
}
