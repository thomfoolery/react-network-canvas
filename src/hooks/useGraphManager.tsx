import React, {
  createContext,
  useMemo,
  useContext,
  useEffect,
  ReactNode,
} from "react";

import {Publisher, svgGeneratePath} from "@app/utils";
import {useDragManager, useBridge} from "@app/hooks";
import {DRAFT_EDGE_ID} from "@app/constants";
import * as Types from "@app/types";

import {v1 as generateUuid} from "uuid";

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
  bridge?: Types.Bridge;
  dragManager?: any;
  workspace?: Types.Workspace;
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
  __: GraphManagerPrivateProps = {
    nodes: [],
    edges: [],
    nodesByIdHash: {},
    edgesByIdHash: {},
    edgesByNodeIdHash: {},
    selectedNodeIds: [],
    bridge: undefined,
    workspace: undefined,
    dragManager: undefined,
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

    this.handleDragMove = this.handleDragMove.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
  }

  // bridge
  get bridge() {
    return {...this.__.bridge};
  }
  set bridge(bridge: any) {
    this.__.bridge = bridge;
  }
  // workspace
  get workspace() {
    return {...this.__.workspace};
  }
  set workspace(workspace: any) {
    this.__.workspace = workspace;
  }
  // nodes
  get nodes() {
    return [...this.__.nodes];
  }
  set nodes(nodes: Types.Node[]) {
    this.__.nodes = nodes;
    this.__.nodesByIdHash = getObjectsByIdHash(nodes);
    this.__.subscriptions.nodesChange.notifyAll(nodes);
  }
  getNodeById(id: string): Types.Node {
    return {...this.__.nodesByIdHash[id]};
  }
  getNodesByEdgeId(id: string): {from?: Types.Node; to?: Types.Node} {
    const edge: Types.Edge = this.__.edgesByIdHash[id];
    if (edge) {
      const from = this.__.nodesByIdHash[edge.from.nodeId];
      const to = this.__.nodesByIdHash[edge.to.nodeId];
      return {from, to};
    }
    return {from: undefined, to: undefined};
  }
  createNode(nodeProps: Partial<Types.Node>): Types.Node {
    const node = {
      id: generateUuid(),
      inputPorts: [{id: generateUuid()}],
      outputPorts: [{id: generateUuid()}],
      position: {x: 0, y: 0},
      ...nodeProps,
    };

    this.nodes = [...this.nodes, node];

    this.bridge.onUpdateGraph({
      action: "CREATE_NODE",
      subject: node,
      graph: {
        nodes: this.nodes,
        edges: this.edges,
      },
    });

    return node;
  }
  removeNodeById(id: string) {
    const edges = this.__.edgesByNodeIdHash[id] || [];
    const removedEdgeIds = edges.map(({id}) => id);

    this.__.selectedNodeIds = this.__.selectedNodeIds.filter(
      (selectedNodeId) => selectedNodeId !== id
    );
    this.edges = this.__.edges.filter(
      (edge) => !removedEdgeIds.includes(edge.id)
    );
    this.nodes = this.__.nodes.filter((node) => node.id != id);

    this.bridge.onUpdateGraph({
      action: "DELETE_NODE",
      subject: this.__.nodesByIdHash[id],
      graph: {
        nodes: this.nodes,
        edges: this.edges,
      },
    });
  }
  removeNodesByIds(removedNodeIds: string[]) {
    const removedEdgeIds: string[] = removedNodeIds.reduce(
      (acc: string[], id: string) => {
        const edges = this.__.edgesByNodeIdHash[id] || [];
        return [...acc, ...edges.map(({id}) => id)];
      },
      []
    );

    this.__.selectedNodeIds = this.__.selectedNodeIds.filter(
      (selectedNodeId) => !removedNodeIds.includes(selectedNodeId)
    );
    this.edges = this.__.edges.filter(
      (edge) => !removedEdgeIds.includes(edge.id)
    );
    this.nodes = this.__.nodes.filter(
      (node) => !removedNodeIds.includes(node.id)
    );

    removedNodeIds.forEach((id) => {
      this.bridge.onUpdateGraph({
        action: "DELETE_NODE",
        subject: this.__.nodesByIdHash[id],
        graph: {
          nodes: this.nodes,
          edges: this.edges,
        },
      });
    });
  }
  subscribeToNodesChange(fn: Function) {
    this.__.subscriptions.nodesChange.addListenerForId("default", fn);
  }
  unsubscribeToNodesChange(fn: Function) {
    this.__.subscriptions.nodesChange.removeListenerForId("default", fn);
  }
  // position
  set dragManager(dragManager: any) {
    this.__.dragManager = dragManager;
  }
  handleDragMove(event, dragDelta: Types.Position, dragData: any) {
    const {selectedNodeIds, dragManager, workspace} = this.__;

    this.__.subscriptions.dragDeltaById.notifyIds(selectedNodeIds, dragDelta);

    if (workspace && dragManager?.dragData?.dragType === "port") {
      const position = workspace.getCanvasPosition(event);

      const x1 = dragData.port.position.x;
      const y1 = dragData.port.position.y;
      const x2 = position.x;
      const y2 = position.y;

      this.updateDraftEdgePath(x1, y1, x2, y2);
    }
  }
  handleDragEnd(event, dragDelta: Types.Position, dragData: any) {
    const {selectedNodeIds, subscriptions} = this.__;

    subscriptions.dragDeltaById.notifyIds(selectedNodeIds, {
      x: 0,
      y: 0,
    });

    if (dragData?.dragType === "node") {
      selectedNodeIds.forEach((id) =>
        this.updateNodePositionById(id, dragDelta)
      );
    }
    if (dragData?.dragType === "port") {
      this.clearDraftEdgePath();
    }
  }
  updateNodePositionById(id: string, dragDelta: Types.Position) {
    const node = this.__.nodesByIdHash[id];
    const position = {
      x: node.position.x + dragDelta.x,
      y: node.position.y + dragDelta.y,
    };

    node.position = position;
    this.__.subscriptions.nodePositionChangeById.notifyIds([id], position);
  }
  subscribeToDragDeltaById(id: string, fn: Function) {
    this.__.subscriptions.dragDeltaById.addListenerForId(id, fn);
  }
  unsubscribeToDragDeltaById(id: string, fn: Function) {
    this.__.subscriptions.dragDeltaById.removeListenerForId(id, fn);
  }
  subscribeToNodePositionChangeById(id: string, fn: Function) {
    this.__.subscriptions.nodePositionChangeById.addListenerForId(id, fn);
  }
  unsubscribeToNodePositionChangeById(id: string, fn: Function) {
    this.__.subscriptions.nodePositionChangeById.addListenerForId(id, fn);
  }
  // selected ids
  get selectedNodeIds(): string[] {
    return [...this.__.selectedNodeIds];
  }
  set selectedNodeIds(selectedNodeIds: string[]) {
    const unselectedNodeIds = this.__.selectedNodeIds.filter(
      (id) => !selectedNodeIds.includes(id)
    );
    const newSelectedNodeIds = selectedNodeIds.filter(
      (id) => !this.__.selectedNodeIds.includes(id)
    );

    this.__.selectedNodeIds = [...selectedNodeIds];

    requestAnimationFrame(() => {
      this.__.subscriptions.isSelectedById.notifyIds(newSelectedNodeIds, true);
      this.__.subscriptions.isSelectedById.notifyIds(unselectedNodeIds, false);
    });
  }
  appendSelectedNodeId(id: string) {
    if (this.__.selectedNodeIds.includes(id)) return;
    const selectedNodeIds = Array.from(
      new Set([...this.__.selectedNodeIds, id])
    );

    this.selectedNodeIds = selectedNodeIds;
  }
  appendSelectedNodeIds(appendedNodeIds: string[]) {
    const selectedNodeIds = Array.from(
      new Set([...this.__.selectedNodeIds, ...appendedNodeIds])
    );

    this.selectedNodeIds = selectedNodeIds;
  }
  removeSelectedNodeId(id: string) {
    if (!this.__.selectedNodeIds.includes(id)) return;
    const selectedNodeIds = this.__.selectedNodeIds.filter(
      (selectedNodeId) => selectedNodeId !== id
    );

    this.selectedNodeIds = selectedNodeIds;
  }
  removeSelectedNodeIds(unselectedNodeIds: string[]) {
    const selectedNodeIds = this.__.selectedNodeIds.filter(
      (id) => !unselectedNodeIds.includes(id)
    );

    this.selectedNodeIds = selectedNodeIds;
  }
  subscribeToIsSelectedById(id: string, fn: Function) {
    this.__.subscriptions.isSelectedById.addListenerForId(id, fn);
  }
  unsubscribeToIsSelectedById(id: string, fn: Function) {
    this.__.subscriptions.isSelectedById.removeListenerForId(id, fn);
  }
  // edges
  get edges() {
    return [...this.__.edges];
  }
  set edges(edges: Types.Edge[]) {
    this.__.edges = edges;
    this.__.edgesByIdHash = getObjectsByIdHash(edges);
    this.__.edgesByNodeIdHash = getEdgesByNodeIdHash(edges);
    this.__.subscriptions.edgesChange.notifyAll(edges);
  }
  getEdgeById(id: string): Types.Edge {
    return {...this.__.edgesByIdHash[id]};
  }
  getEdgesByNodeId(id: string): Types.Edge[] {
    return this.__.edgesByNodeIdHash[id]
      ? [...this.__.edgesByNodeIdHash[id]]
      : [];
  }
  createEdge(edgeProps: Partial<Types.Edge>): Types.Edge {
    const edge: Types.Edge = {
      id: generateUuid(),
      from: {
        nodeId: "",
        portId: "",
      },
      to: {
        nodeId: "",
        portId: "",
      },
      ...edgeProps,
    };

    this.edges = [...this.__.edges, edge];
    // trigger render to draw edges
    this.updateNodePositionById(edge.from.nodeId, {x: 0, y: 0});

    this.bridge.onUpdateGraph({
      action: "CREATE_EDGE",
      subject: edge,
      graph: {
        nodes: this.nodes,
        edges: this.edges,
      },
    });

    return edge;
  }
  removeEdgeById(id: string) {
    const filter = (edge) => edge.id != id;
    const {edgesByNodeIdHash} = this.__;
    const edge = this.__.edgesByIdHash[id];
    const fromNodeEdges = edgesByNodeIdHash[edge.from.nodeId];
    const toNodeEdges = edgesByNodeIdHash[edge.to.nodeId];

    edgesByNodeIdHash[edge.from.nodeId] = fromNodeEdges.filter(filter);
    edgesByNodeIdHash[edge.to.nodeId] = toNodeEdges.filter(filter);

    this.edges = this.__.edges.filter(filter);

    // redraw from and to nodes
    this.updateNodePositionById(edge.from.nodeId, {x: 0, y: 0});
    this.updateNodePositionById(edge.to.nodeId, {x: 0, y: 0});

    this.bridge.onUpdateGraph({
      action: "DELETE_EDGE",
      subject: edge,
      graph: {
        nodes: this.nodes,
        edges: this.edges,
      },
    });
  }
  updateDraftEdgePath(x1: number, y1: number, x2: number, y2: number) {
    const svgPath = document.querySelector(`#Edge-${DRAFT_EDGE_ID}`);
    const {dragData} = this.__.dragManager;

    const path = svgGeneratePath(x1, y1, x2, y2);

    svgPath?.setAttribute("d", path);
    svgPath?.nextElementSibling?.setAttribute("d", path);
  }
  clearDraftEdgePath() {
    const svgPath = document.querySelector(`#Edge-${DRAFT_EDGE_ID}`);

    svgPath?.setAttribute("d", "");
    svgPath?.nextElementSibling?.setAttribute("d", "");
  }
  subscribeToEdgesChange(id: string, fn: Function) {
    this.__.subscriptions.edgesChange.addListenerForId(id, fn);
  }
  unsubscribeToEdgesChange(id: string, fn: Function) {
    this.__.subscriptions.edgesChange.removeListenerForId(id, fn);
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
  const bridge = useBridge();

  useEffect(() => {
    const id = "graphManager";

    bridge.connect(graphManager);
    dragManager.subscribeToDragMove(id, graphManager.handleDragMove);
    dragManager.subscribeToDragEnd(id, graphManager.handleDragEnd);

    return () => {
      dragManager.unsubscribeToDragMove(id, graphManager.handleDragMove);
      dragManager.unsubscribeToDragEnd(id, graphManager.handleDragEnd);
    };
  }, [bridge, dragManager]);

  return <Context.Provider value={graphManager}>{children}</Context.Provider>;
}

export function useGraphManager() {
  return useContext(Context);
}
