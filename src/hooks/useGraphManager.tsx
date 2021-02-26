import React, {
  createContext,
  useMemo,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import {v1 as generateUuid} from "uuid";
import {useDragManager} from "./useDragManager";
import {Publisher} from "@app/utils";
import * as Types from "@app/types";

const Context = createContext();

function getObjectsByIdHash(objects) {
  return objects.reduce((acc, object) => {
    acc[object.id] = object;
    return acc;
  }, {});
}

function getEdgesByNodeIdHash(edges) {
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
interface GraphManagerPrivateProps {
  nodes: Types.Node[];
  edges: Types.Edge[];
  nodesByIdHash: {[id: string]: Types.Node};
  edgesByIdHash: {[id: string]: Types.Edge};
  edgesByNodeIdHash: {[id: string]: Types.Edge[]};
  selectedNodeIds: string[];
  dragDelta: Types.Position;
  subscriptions: {
    nodePositionChangeById: Publisher;
    isSelectedById: Publisher;
    dragDeltaById: Publisher;
    nodesChange: Publisher;
    edgesChange: Publisher;
  };
}

interface GraphManagerArguments {
  nodes: Types.Node[];
  edges: Types.Edge[];
}
class GraphManager {
  _private: GraphManagerPrivateProps = {
    nodes: [],
    edges: [],
    nodesByIdHash: {},
    edgesByIdHash: {},
    edgesByNodeIdHash: {},
    selectedNodeIds: [],
    dragDelta: {x: 0, y: 0},
    subscriptions: {
      nodePositionChangeById: new Publisher(),
      isSelectedById: new Publisher(),
      dragDeltaById: new Publisher(),
      nodesChange: new Publisher(),
      edgesChange: new Publisher(),
    },
  };

  constructor({nodes = [], edges = []}: GraphManagerArguments) {
    this.nodes = nodes;
    this.edges = edges;
  }

  // nodes
  get nodes() {
    return [...this._private.nodes];
  }
  set nodes(nodes: Types.Node[]) {
    this._private.nodes = nodes;
    this._private.nodesByIdHash = getObjectsByIdHash(nodes);
    this._private.subscriptions.nodesChange.notifyAll(nodes);
  }
  getNodeById(id: string): Types.Node {
    return {...this._private.nodesByIdHash[id]};
  }
  getNodesByEdgeId(id: string): {from?: Types.Node; to?: Types.Node} {
    const edge: Types.Edge = this._private.edgesByIdHash[id];
    if (edge) {
      const from = this._private.nodesByIdHash[edge.from.nodeId];
      const to = this._private.nodesByIdHash[edge.to.nodeId];
      return {from, to};
    }
    return {from: undefined, to: undefined};
  }
  createNode(nodeProps) {
    const node = {
      id: generateUuid(),
      inputPorts: [{id: generateUuid()}],
      outputPorts: [{id: generateUuid()}],
      position: {x: 0, y: 0},
      ...nodeProps,
    };

    this.nodes = [...this.nodes, node];
  }
  removeNodeById(id: string) {
    const removedEdgeIds = this._private.edgesByNodeIdHash[id].map(
      ({id}) => id
    );

    this.nodes = this._private.nodes.filter((node) => node.id != id);
    this.edges = this._private.edges.filter(
      (edge) => !removedEdgeIds.includes(edge.id)
    );
  }
  subscribeToNodesChange(fn: Function) {
    this._private.subscriptions.nodesChange.addListenerForId("default", fn);
  }
  unsubscribeToNodesChange(fn: Function) {
    this._private.subscriptions.nodesChange.removeListenerForId("default", fn);
  }
  // position
  handleDragDelta(dragDelta: Types.Position) {
    const {selectedNodeIds} = this._private;
    this._private.subscriptions.dragDeltaById.notifyIds(
      selectedNodeIds,
      dragDelta
    );
  }
  handleDragEnd(dragDelta: Types.Position) {
    const {selectedNodeIds} = this._private;
    this._private.subscriptions.dragDeltaById.notifyIds(selectedNodeIds, {
      x: 0,
      y: 0,
    });
    selectedNodeIds.forEach((id) => this.updateNodePositionById(id, dragDelta));
  }
  updateNodePositionById(id: string, dragDelta: Types.Position) {
    const node = this._private.nodesByIdHash[id];
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
  subscribeToDragDeltaById(id: string, fn: Function) {
    this._private.subscriptions.dragDeltaById.addListenerForId(id, fn);
  }
  unsubscribeToDragDeltaById(id: string, fn: Function) {
    this._private.subscriptions.dragDeltaById.removeListenerForId(id, fn);
  }
  subscribeToNodePositionChangeById(id: string, fn: Function) {
    this._private.subscriptions.nodePositionChangeById.addListenerForId(id, fn);
  }
  unsubscribeToNodePositionChangeById(id: string, fn: Function) {
    this._private.subscriptions.nodePositionChangeById.addListenerForId(id, fn);
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
  subscribeToIsSelectedById(id: string, fn: Function) {
    this._private.subscriptions.isSelectedById.addListenerForId(id, fn);
  }
  unsubscribeToIsSelectedById(id: string, fn: Function) {
    this._private.subscriptions.isSelectedById.removeListenerForId(id, fn);
  }
  // edges
  get edges() {
    return [...this._private.edges];
  }
  set edges(edges: Types.Edge[]) {
    this._private.edges = edges;
    this._private.edgesByIdHash = getObjectsByIdHash(edges);
    this._private.edgesByNodeIdHash = getEdgesByNodeIdHash(edges);
    this._private.subscriptions.edgesChange.notifyAll(edges);
  }
  getEdgeById(id: string): Types.Edge {
    return {...this._private.edgesByIdHash[id]};
  }
  getEdgesByNodeId(id: string): Types.Edge[] {
    return this._private.edgesByNodeIdHash[id]
      ? [...this._private.edgesByNodeIdHash[id]]
      : [];
  }
  appendEdge(edge: Types.Edge) {
    this.edges = this._private.edges.concat(edge);
  }
  removeEdgeById(id: string) {
    const filter = (edge) => edge.id != id;
    const {edgesByNodeIdHash} = this._private;
    const edge = this._private.edgesByIdHash[id];
    const fromNodeEdges = edgesByNodeIdHash[edge.from.nodeId];
    const toNodeEdges = edgesByNodeIdHash[edge.to.nodeId];

    edgesByNodeIdHash[edge.from.nodeId] = fromNodeEdges.filter(filter);
    edgesByNodeIdHash[edge.to.nodeId] = toNodeEdges.filter(filter);

    this.edges = this._private.edges.filter(filter);

    // redraw from and to nodes
    this.updateNodePositionById(edge.from.nodeId, {x: 0, y: 0});
    this.updateNodePositionById(edge.to.nodeId, {x: 0, y: 0});
  }
  subscribeToEdgesChange(fn: Function) {
    this._private.subscriptions.edgesChange.addListenerForId("default", fn);
  }
  unsubscribeToEdgesChange(fn: Function) {
    this._private.subscriptions.edgesChange.removeListenerForId("default", fn);
  }
}

interface Props {
  nodes: Types.Node[];
  edges: Types.Edge[];
  children?: ReactNode;
}

export function GraphManagerProvider(props: Props) {
  const {nodes, edges, children} = props;
  const graphManager = useMemo(() => new GraphManager({nodes, edges}), []);
  const dragManager = useDragManager();

  useEffect(() => {
    function handleDragMove(_, dragDelta) {
      graphManager.handleDragDelta(dragDelta);
    }
    function handleDragEnd(_, dragDelta) {
      graphManager.handleDragEnd(dragDelta);
    }

    dragManager.subscribeToDragMove("graphManager", handleDragMove);
    dragManager.subscribeToDragEnd("graphManager", handleDragEnd);

    return () => {
      dragManager.unsubscribeToDragMove("graphManager", handleDragMove);
      dragManager.unsubscribeToDragEnd("graphManager", handleDragEnd);
    };
  }, [dragManager]);

  return <Context.Provider value={graphManager}>{children}</Context.Provider>;
}

export function useGraphManager() {
  return useContext(Context);
}
