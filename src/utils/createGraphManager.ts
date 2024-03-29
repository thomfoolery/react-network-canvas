import { v1 as generateUuid } from "uuid";
import * as Types from "@component/types";
import {
  roundToGrid,
  svgGeneratePath,
  createPublisher,
} from "@component/utils";

function getObjectsByIdHash(objects) {
  return objects.reduce((acc, object) => {
    acc[object.id] = object;
    return acc;
  }, {});
}

function getEdgesByNodeIdHash(edges) {
  return edges.reduce((acc, edge) => {
    const { from, to } = edge;

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
  nodesByIdHash: { [id: string]: Types.Node };
  edgesByIdHash: { [id: string]: Types.Edge };
  edgesByNodeIdHash: { [id: string]: Types.Edge[] };
  selectedNodeIds: string[];
  callbacks?: Types.Callbacks;
  options: Types.Options;
  dragManager?: Types.DragManager;
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
  options: Types.Options;
  nodes: Types.Node[];
  edges: Types.Edge[];
  callbacks?: Types.Callbacks;
  dragManager?: Types.DragManager;
}

function createGraphManager({
  nodes,
  edges,
  options,
  callbacks,
  dragManager,
}: GraphManagerArguments): Types.GraphManager {
  const DRAFT_EDGE_ID = generateUuid();

  const __: GraphManagerPrivateProps = {
    nodes: [],
    edges: [],
    nodesByIdHash: {},
    edgesByIdHash: {},
    edgesByNodeIdHash: {},
    selectedNodeIds: [],
    options,
    callbacks,
    dragManager,
    workspace: undefined,
    subscriptions: {
      nodePositionChangeById: createPublisher(),
      isSelectedById: createPublisher(),
      dragDeltaById: createPublisher(),
      nodesChange: createPublisher(),
      edgesChange: createPublisher(),
    },
  };

  setNodes(nodes);
  setEdges(edges);

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

  function setSelectedNodeIds(selectedNodeIds: string[]) {
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
      __.callbacks?.onChangeSelectedNodeIds(selectedNodeIds, API);
    });
  }

  function updateNodePositionById(id: string, dragDelta: Types.Position) {
    const { isSnapToGridEnabled } = options;
    const node = __.nodesByIdHash[id];
    const position = isSnapToGridEnabled
      ? roundToGrid(
          {
            x: node.position.x + dragDelta.x,
            y: node.position.y + dragDelta.y,
          },
          options.gridSize
        )
      : {
          x: node.position.x + dragDelta.x,
          y: node.position.y + dragDelta.y,
        };

    node.position = position;
    __.subscriptions.nodePositionChangeById.notifyIds([id], position);

    __.callbacks?.onMutateGraph(
      {
        action: "UPDATE_NODE",
        subject: node,
        graph: {
          nodes: [...__.nodes],
          edges: [...__.edges],
        },
      },
      API
    );
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

  const API = {
    // options
    get options() {
      return { ...__.options } as Types.Options;
    },
    set options(options: Types.Options) {
      __.options = options;
    },
    // callbacks
    get callbacks() {
      return { ...__.callbacks } as Types.Callbacks;
    },
    set callbacks(callbacks: Types.Callbacks) {
      __.callbacks = callbacks;
    },
    // workspace
    get workspace() {
      return { ...__.workspace } as Types.Workspace;
    },
    set workspace(workspace: Types.Workspace) {
      __.workspace = workspace;
    },
    // nodes
    get nodes() {
      return [...__.nodes];
    },
    set nodes(nodes: Types.Node[]) {
      setNodes(nodes);
    },
    getNodeById(id: string) {
      return { ...__.nodesByIdHash[id] };
    },
    getNodesByEdgeId(id: string): { from?: Types.Node; to?: Types.Node } {
      const edge: Types.Edge = __.edgesByIdHash[id];
      if (edge) {
        const from = __.nodesByIdHash[edge.from.nodeId];
        const to = __.nodesByIdHash[edge.to.nodeId];
        return { from, to };
      }
      return { from: undefined, to: undefined };
    },
    createNode(nodeProps: Omit<Types.Node, "id">) {
      const { isSnapToGridEnabled, gridSize } = options;
      const position: Types.Position = isSnapToGridEnabled
        ? roundToGrid(nodeProps.position, gridSize)
        : nodeProps.position || { x: NaN, y: NaN };

      const node: Types.Node = {
        id: generateUuid(),
        ...nodeProps,
        position,
      };

      setNodes([...__.nodes, node]);

      __.callbacks?.onMutateGraph(
        {
          action: "CREATE_NODE",
          subject: node,
          graph: {
            nodes: [...__.nodes],
            edges: [...__.edges],
          },
        },
        API
      );

      return node;
    },
    removeNodeById(id: string) {
      const subject = __.nodesByIdHash[id];
      const edges = __.edgesByNodeIdHash[id] || [];
      const removedEdgeIds = edges.map(({ id }) => id);

      setSelectedNodeIds(
        __.selectedNodeIds.filter((selectedNodeId) => selectedNodeId !== id)
      );
      setEdges(__.edges.filter((edge) => !removedEdgeIds.includes(edge.id)));
      setNodes(__.nodes.filter((node) => node.id != id));

      __.callbacks?.onMutateGraph(
        {
          subject,
          action: "DELETE_NODE",
          graph: {
            nodes: [...__.nodes],
            edges: [...__.edges],
          },
        },
        API
      );
    },
    removeNodesByIds(removedNodeIds: string[]) {
      const removedEdgeIds: string[] = removedNodeIds.reduce(
        (acc: string[], id: string) => {
          const edges = __.edgesByNodeIdHash[id] || [];
          return [...acc, ...edges.map(({ id }) => id)];
        },
        []
      );

      const removedNodes = removedNodeIds.reduce((acc, nodeId) => {
        return { ...acc, [nodeId]: __.nodesByIdHash[nodeId] };
      }, {});

      setSelectedNodeIds(
        __.selectedNodeIds.filter(
          (selectedNodeId) => !removedNodeIds.includes(selectedNodeId)
        )
      );
      setEdges(__.edges.filter((edge) => !removedEdgeIds.includes(edge.id)));
      setNodes(__.nodes.filter((node) => !removedNodeIds.includes(node.id)));

      removedNodeIds.forEach((id) => {
        __.callbacks?.onMutateGraph(
          {
            action: "DELETE_NODE",
            subject: removedNodes[id],
            graph: {
              nodes: __.nodes,
              edges: __.edges,
            },
          },
          API
        );
      });
    },
    subscribeToNodesChange(fn: () => void) {
      __.subscriptions.nodesChange.addListenerForId("default", fn);
    },
    unsubscribeToNodesChange(fn: () => void) {
      __.subscriptions.nodesChange.removeListenerForId("default", fn);
    },
    // position
    get dragManager(): Types.DragManager {
      return __.dragManager as Types.DragManager;
    },
    set dragManager(dragManager: Types.DragManager) {
      __.dragManager = dragManager;
    },
    handleDragMove(event, dragDelta: Types.Position, dragData: any) {
      const { selectedNodeIds, dragManager, workspace } = __;

      if (dragManager?.dragData?.source === "node") {
        __.subscriptions.dragDeltaById.notifyIds(selectedNodeIds, dragDelta);
      }

      if (workspace && dragManager?.dragData?.source === "port") {
        const position = workspace.getCanvasPosition(event);

        const x1 = dragData.port.position.x;
        const y1 = dragData.port.position.y;
        const x2 = position.x;
        const y2 = position.y;

        updateDraftEdgePath(x1, y1, x2, y2);
      }
    },
    handleDragEnd(event, dragDelta: Types.Position, dragData: any) {
      const { selectedNodeIds, subscriptions } = __;

      subscriptions.dragDeltaById.notifyIds(selectedNodeIds, {
        x: 0,
        y: 0,
      });

      if (dragData?.source === "node") {
        selectedNodeIds.forEach((id) => updateNodePositionById(id, dragDelta));
      }

      clearDraftEdgePath();
    },
    updateNodePositionById,
    subscribeToDragDeltaById(id: string, fn: () => void) {
      __.subscriptions.dragDeltaById.addListenerForId(id, fn);
    },
    unsubscribeToDragDeltaById(id: string, fn: () => void) {
      __.subscriptions.dragDeltaById.removeListenerForId(id, fn);
    },
    subscribeToNodePositionChangeById(id: string, fn: () => void) {
      __.subscriptions.nodePositionChangeById.addListenerForId(id, fn);
    },
    unsubscribeToNodePositionChangeById(id: string, fn: () => void) {
      __.subscriptions.nodePositionChangeById.addListenerForId(id, fn);
    },
    // selected ids
    get selectedNodeIds(): string[] {
      return [...__.selectedNodeIds];
    },
    set selectedNodeIds(selectedNodeIds: string[]) {
      setSelectedNodeIds(selectedNodeIds);
    },
    appendSelectedNodeId(id: string) {
      if (__.selectedNodeIds.includes(id)) return;
      const selectedNodeIds = Array.from(new Set([...__.selectedNodeIds, id]));

      setSelectedNodeIds(selectedNodeIds);
    },
    appendSelectedNodeIds(appendedNodeIds: string[]) {
      const selectedNodeIds = Array.from(
        new Set([...__.selectedNodeIds, ...appendedNodeIds])
      );

      setSelectedNodeIds(selectedNodeIds);
    },
    removeSelectedNodeId(id: string) {
      if (!__.selectedNodeIds.includes(id)) return;
      const selectedNodeIds = __.selectedNodeIds.filter(
        (selectedNodeId) => selectedNodeId !== id
      );

      setSelectedNodeIds(selectedNodeIds);
    },
    removeSelectedNodeIds(unselectedNodeIds: string[]) {
      const selectedNodeIds = __.selectedNodeIds.filter(
        (id) => !unselectedNodeIds.includes(id)
      );

      setSelectedNodeIds(selectedNodeIds);
    },
    subscribeToIsSelectedById(id: string, fn: () => void) {
      __.subscriptions.isSelectedById.addListenerForId(id, fn);
    },
    unsubscribeToIsSelectedById(id: string, fn: () => void) {
      __.subscriptions.isSelectedById.removeListenerForId(id, fn);
    },
    // edges
    get edges(): Types.Edge[] {
      return [...__.edges];
    },
    set edges(edges: Types.Edge[]) {
      setEdges(edges);
    },
    getEdgeById(id: string): Types.Edge {
      return { ...__.edgesByIdHash[id] };
    },
    getEdgesByNodeId(id: string): Types.Edge[] {
      return __.edgesByNodeIdHash[id] ? [...__.edgesByNodeIdHash[id]] : [];
    },
    createEdge(edgeProps: Omit<Types.Edge, "id">) {
      const edge: Types.Edge = {
        id: generateUuid(),
        ...edgeProps,
      };

      setEdges([...__.edges, edge]);

      // trigger render to draw edges
      updateNodePositionById(edge.from.nodeId, { x: 0, y: 0 });

      __.callbacks?.onMutateGraph(
        {
          action: "CREATE_EDGE",
          subject: edge,
          graph: {
            nodes: [...__.nodes],
            edges: [...__.edges],
          },
        },
        API
      );

      return edge as Types.Edge;
    },
    removeEdgeById(id: string) {
      const filter = (edge) => edge.id != id;
      const { edgesByNodeIdHash } = __;
      const edge = __.edgesByIdHash[id];
      const fromNodeEdges = edgesByNodeIdHash[edge.from.nodeId];
      const toNodeEdges = edgesByNodeIdHash[edge.to.nodeId];

      edgesByNodeIdHash[edge.from.nodeId] = fromNodeEdges.filter(filter);
      edgesByNodeIdHash[edge.to.nodeId] = toNodeEdges.filter(filter);

      setEdges(__.edges.filter(filter));

      // redraw from and to nodes
      updateNodePositionById(edge.from.nodeId, { x: 0, y: 0 });
      updateNodePositionById(edge.to.nodeId, { x: 0, y: 0 });

      __.callbacks?.onMutateGraph(
        {
          action: "DELETE_EDGE",
          subject: edge,
          graph: {
            nodes: [...__.nodes],
            edges: [...__.edges],
          },
        },
        API
      );
    },

    get draftEdgeId() {
      return DRAFT_EDGE_ID;
    },

    clearDraftEdgePath,
    updateDraftEdgePath,
    subscribeToEdgesChange(id: string, fn: () => void) {
      __.subscriptions.edgesChange.addListenerForId(id, fn);
    },
    unsubscribeToEdgesChange(id: string, fn: () => void) {
      __.subscriptions.edgesChange.removeListenerForId(id, fn);
    },
    // import/export
    import({ nodes, edges }) {
      const { canvasMargin } = __.options;
      const {
        initialPanOffset = {
          x: canvasMargin,
          y: canvasMargin,
        },
      } = __.options;

      const panPosition = nodes.reduce(
        (acc, node) => {
          const x = node.position.x < acc.x ? node.position.x : acc.x;
          const y = node.position.y < acc.y ? node.position.y : acc.y;

          return { x, y };
        },
        { x: Infinity, y: Infinity }
      );

      requestAnimationFrame(() => {
        if (panPosition.x === Infinity || panPosition.y === Infinity) return;
        __.workspace?.setPan({
          x: panPosition.x * -1 + initialPanOffset.x,
          y: panPosition.y * -1 + initialPanOffset.y,
        });
      });

      setNodes(nodes);
      setEdges(edges);
    },
    export() {
      return {
        nodes: [...__.nodes],
        edges: [...__.edges],
      };
    },
  };

  return API;
}

export { createGraphManager };
