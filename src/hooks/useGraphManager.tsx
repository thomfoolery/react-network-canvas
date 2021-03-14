import React, {
  createContext,
  useMemo,
  useContext,
  useEffect,
  ReactNode,
} from "react";

import {createPublisher, svgGeneratePath} from "@component/utils";
import {useDragManager, useBridge} from "@component/hooks";
import {DRAFT_EDGE_ID} from "@component/constants";
import * as Types from "@component/types";

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
    nodePositionChangeById: Types.Publisher;
    isSelectedById: Types.Publisher;
    dragDeltaById: Types.Publisher;
    nodesChange: Types.Publisher;
    edgesChange: Types.Publisher;
  };
}

interface GraphManagerArguments {
  nodes?: Types.Node[];
  edges?: Types.Edge[];
}

function createGraphManager({
  nodes = [],
  edges = [],
}: GraphManagerArguments = {}) {
  const __: GraphManagerPrivateProps = {
    nodes,
    edges,
    nodesByIdHash: {},
    edgesByIdHash: {},
    edgesByNodeIdHash: {},
    selectedNodeIds: [],
    bridge: undefined,
    workspace: undefined,
    dragManager: undefined,
    subscriptions: {
      nodePositionChangeById: createPublisher(),
      isSelectedById: createPublisher(),
      dragDeltaById: createPublisher(),
      nodesChange: createPublisher(),
      edgesChange: createPublisher(),
    },
  };

  function setNodes(nodes: Types.Node[]) {
    __.nodes = [...nodes];
    __.nodesByIdHash = getObjectsByIdHash(__.nodes);
    __.subscriptions.nodesChange.notifyAll(__.nodes);
  }

  function setEdges(edges: Types.Edge[]) {
    __.edges = [...edges];
    __.edgesByIdHash = getObjectsByIdHash(__.edges);
    __.edgesByNodeIdHash = getEdgesByNodeIdHash(__.edges);
    __.subscriptions.edgesChange.notifyAll(__.edges);
  }

  function updateNodePositionById(id: string, dragDelta: Types.Position) {
    const node = __.nodesByIdHash[id];
    const position = {
      x: node.position.x + dragDelta.x,
      y: node.position.y + dragDelta.y,
    };

    node.position = position;
    __.subscriptions.nodePositionChangeById.notifyIds([id], position);
  }

  function clearDraftEdgePath() {
    const svgPath = document.querySelector(`#Edge-${DRAFT_EDGE_ID}`);

    svgPath?.setAttribute("d", "");
    svgPath?.nextElementSibling?.setAttribute("d", "");
  }

  function updateDraftEdgePath(x1: number, y1: number, x2: number, y2: number) {
    const svgPath = document.querySelector(`#Edge-${DRAFT_EDGE_ID}`);
    const path = svgGeneratePath(x1, y1, x2, y2);

    svgPath?.setAttribute("d", path);
    svgPath?.nextElementSibling?.setAttribute("d", path);
  }

  return {
    // bridge
    get bridge() {
      return {...__.bridge};
    },
    set bridge(bridge: any) {
      __.bridge = bridge;
    },
    // workspace
    get workspace() {
      return {...__.workspace};
    },
    set workspace(workspace: any) {
      __.workspace = workspace;
    },
    // nodes
    get nodes() {
      return [...__.nodes];
    },
    set nodes(nodes: Types.Node[]) {
      setNodes(nodes);
    },
    getNodeById(id: string): Types.Node {
      return {...__.nodesByIdHash[id]};
    },
    getNodesByEdgeId(id: string): {from?: Types.Node; to?: Types.Node} {
      const edge: Types.Edge = __.edgesByIdHash[id];
      if (edge) {
        const from = __.nodesByIdHash[edge.from.nodeId];
        const to = __.nodesByIdHash[edge.to.nodeId];
        return {from, to};
      }
      return {from: undefined, to: undefined};
    },
    createNode(nodeProps: Partial<Types.Node>): Types.Node {
      const node = {
        id: generateUuid(),
        inputPorts: [{id: generateUuid()}],
        outputPorts: [{id: generateUuid()}],
        position: {x: 0, y: 0},
        ...nodeProps,
      };

      setNodes([...__.nodes, node]);

      __.bridge?.onUpdateGraph({
        action: "CREATE_NODE",
        subject: node,
        graph: {
          nodes: [...__.nodes],
          edges: [...__.edges],
        },
      });

      return node;
    },
    removeNodeById(id: string) {
      const edges = __.edgesByNodeIdHash[id] || [];
      const removedEdgeIds = edges.map(({id}) => id);

      __.selectedNodeIds = __.selectedNodeIds.filter(
        (selectedNodeId) => selectedNodeId !== id
      );
      setEdges(__.edges.filter((edge) => !removedEdgeIds.includes(edge.id)));
      setNodes(__.nodes.filter((node) => node.id != id));

      __.bridge?.onUpdateGraph({
        action: "DELETE_NODE",
        subject: __.nodesByIdHash[id],
        graph: {
          nodes: [...__.nodes],
          edges: [...__.edges],
        },
      });
    },
    removeNodesByIds(removedNodeIds: string[]) {
      const removedEdgeIds: string[] = removedNodeIds.reduce(
        (acc: string[], id: string) => {
          const edges = __.edgesByNodeIdHash[id] || [];
          return [...acc, ...edges.map(({id}) => id)];
        },
        []
      );

      __.selectedNodeIds = __.selectedNodeIds.filter(
        (selectedNodeId) => !removedNodeIds.includes(selectedNodeId)
      );
      setEdges(__.edges.filter((edge) => !removedEdgeIds.includes(edge.id)));
      setNodes(__.nodes.filter((node) => !removedNodeIds.includes(node.id)));

      removedNodeIds.forEach((id) => {
        __.bridge?.onUpdateGraph({
          action: "DELETE_NODE",
          subject: __.nodesByIdHash[id],
          graph: {
            nodes: __.nodes,
            edges: __.edges,
          },
        });
      });
    },
    subscribeToNodesChange(fn: Function) {
      __.subscriptions.nodesChange.addListenerForId("default", fn);
    },
    unsubscribeToNodesChange(fn: Function) {
      __.subscriptions.nodesChange.removeListenerForId("default", fn);
    },
    // position
    set dragManager(dragManager: any) {
      __.dragManager = dragManager;
    },
    handleDragMove(event, dragDelta: Types.Position, dragData: any) {
      const {selectedNodeIds, dragManager, workspace} = __;

      __.subscriptions.dragDeltaById.notifyIds(selectedNodeIds, dragDelta);

      if (workspace && dragManager?.dragData?.dragType === "port") {
        const position = workspace.getCanvasPosition(event);

        const x1 = dragData.port.position.x;
        const y1 = dragData.port.position.y;
        const x2 = position.x;
        const y2 = position.y;

        updateDraftEdgePath(x1, y1, x2, y2);
      }
    },
    handleDragEnd(event, dragDelta: Types.Position, dragData: any) {
      const {selectedNodeIds, subscriptions} = __;

      subscriptions.dragDeltaById.notifyIds(selectedNodeIds, {
        x: 0,
        y: 0,
      });

      if (dragData?.dragType === "node") {
        selectedNodeIds.forEach((id) => updateNodePositionById(id, dragDelta));
      }
      if (dragData?.dragType === "port") {
        clearDraftEdgePath();
      }
    },
    updateNodePositionById,
    subscribeToDragDeltaById(id: string, fn: Function) {
      __.subscriptions.dragDeltaById.addListenerForId(id, fn);
    },
    unsubscribeToDragDeltaById(id: string, fn: Function) {
      __.subscriptions.dragDeltaById.removeListenerForId(id, fn);
    },
    subscribeToNodePositionChangeById(id: string, fn: Function) {
      __.subscriptions.nodePositionChangeById.addListenerForId(id, fn);
    },
    unsubscribeToNodePositionChangeById(id: string, fn: Function) {
      __.subscriptions.nodePositionChangeById.addListenerForId(id, fn);
    },
    // selected ids
    get selectedNodeIds(): string[] {
      return [...__.selectedNodeIds];
    },
    set selectedNodeIds(selectedNodeIds: string[]) {
      const unselectedNodeIds = __.selectedNodeIds.filter(
        (id) => !selectedNodeIds.includes(id)
      );
      const newSelectedNodeIds = selectedNodeIds.filter(
        (id) => !__.selectedNodeIds.includes(id)
      );

      __.selectedNodeIds = [...selectedNodeIds];

      requestAnimationFrame(() => {
        __.subscriptions.isSelectedById.notifyIds(newSelectedNodeIds, true);
        __.subscriptions.isSelectedById.notifyIds(unselectedNodeIds, false);
      });
    },
    appendSelectedNodeId(id: string) {
      if (__.selectedNodeIds.includes(id)) return;
      const selectedNodeIds = Array.from(new Set([...__.selectedNodeIds, id]));

      __.selectedNodeIds = selectedNodeIds;
    },
    appendSelectedNodeIds(appendedNodeIds: string[]) {
      const selectedNodeIds = Array.from(
        new Set([...__.selectedNodeIds, ...appendedNodeIds])
      );

      __.selectedNodeIds = selectedNodeIds;
    },
    removeSelectedNodeId(id: string) {
      if (!__.selectedNodeIds.includes(id)) return;
      const selectedNodeIds = __.selectedNodeIds.filter(
        (selectedNodeId) => selectedNodeId !== id
      );

      __.selectedNodeIds = selectedNodeIds;
    },
    removeSelectedNodeIds(unselectedNodeIds: string[]) {
      const selectedNodeIds = __.selectedNodeIds.filter(
        (id) => !unselectedNodeIds.includes(id)
      );

      __.selectedNodeIds = selectedNodeIds;
    },
    subscribeToIsSelectedById(id: string, fn: Function) {
      __.subscriptions.isSelectedById.addListenerForId(id, fn);
    },
    unsubscribeToIsSelectedById(id: string, fn: Function) {
      __.subscriptions.isSelectedById.removeListenerForId(id, fn);
    },
    // edges
    get edges() {
      return [...__.edges];
    },
    set edges(edges: Types.Edge[]) {
      setEdges(edges);
    },
    getEdgeById(id: string): Types.Edge {
      return {...__.edgesByIdHash[id]};
    },
    getEdgesByNodeId(id: string): Types.Edge[] {
      return __.edgesByNodeIdHash[id] ? [...__.edgesByNodeIdHash[id]] : [];
    },
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

      setEdges([...__.edges, edge]);

      // trigger render to draw edges
      updateNodePositionById(edge.from.nodeId, {x: 0, y: 0});

      __.bridge?.onUpdateGraph({
        action: "CREATE_EDGE",
        subject: edge,
        graph: {
          nodes: [...__.nodes],
          edges: [...__.edges],
        },
      });

      return edge;
    },
    removeEdgeById(id: string) {
      const filter = (edge) => edge.id != id;
      const {edgesByNodeIdHash} = __;
      const edge = __.edgesByIdHash[id];
      const fromNodeEdges = edgesByNodeIdHash[edge.from.nodeId];
      const toNodeEdges = edgesByNodeIdHash[edge.to.nodeId];

      edgesByNodeIdHash[edge.from.nodeId] = fromNodeEdges.filter(filter);
      edgesByNodeIdHash[edge.to.nodeId] = toNodeEdges.filter(filter);

      setEdges(__.edges.filter(filter));

      // redraw from and to nodes
      updateNodePositionById(edge.from.nodeId, {x: 0, y: 0});
      updateNodePositionById(edge.to.nodeId, {x: 0, y: 0});

      __.bridge?.onUpdateGraph({
        action: "DELETE_EDGE",
        subject: edge,
        graph: {
          nodes: [...__.nodes],
          edges: [...__.edges],
        },
      });
    },
    clearDraftEdgePath,
    updateDraftEdgePath,
    subscribeToEdgesChange(id: string, fn: Function) {
      __.subscriptions.edgesChange.addListenerForId(id, fn);
    },
    unsubscribeToEdgesChange(id: string, fn: Function) {
      __.subscriptions.edgesChange.removeListenerForId(id, fn);
    },
  };
}

interface Props {
  nodes: Types.Node[];
  edges: Types.Edge[];
  children?: ReactNode;
}

function GraphManagerProvider(props: Props) {
  const {nodes, edges, children} = props;
  const graphManager = useMemo(() => createGraphManager({nodes, edges}), []);
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

function useGraphManager() {
  return useContext(Context);
}

export {createGraphManager, useGraphManager, GraphManagerProvider};
