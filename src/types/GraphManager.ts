import * as Types from "@component/types";

interface GraphManager {
  nodes: Types.Node[];
  edges: Types.Edge[];
  callbacks: Types.Callbacks;
  workspace: Types.Workspace | undefined;
  dragManager: Types.DragManager;
  selectedNodeIds: string[];

  getNodeById(id: string): Types.Node;
  getNodesByEdgeId(id: string): { from?: Types.Node; to?: Types.Node };
  createNode(nodeProps: Partial<Types.Node>): Types.Node | null;
  removeNodeById(id: string): void;
  removeNodesByIds(removedNodeIds: string[]): void;
  subscribeToNodesChange(fn: () => void): void;
  unsubscribeToNodesChange(fn: () => void): void;

  handleDragMove(event, dragDelta: Types.Position, dragData: any): void;
  handleDragEnd(event, dragDelta: Types.Position, dragData: any): void;
  updateNodePositionById(id: string, dragDelta: Types.Position): void;
  subscribeToDragDeltaById(id: string, fn: () => void): void;
  unsubscribeToDragDeltaById(id: string, fn: () => void): void;
  subscribeToNodePositionChangeById(id: string, fn: () => void): void;
  unsubscribeToNodePositionChangeById(id: string, fn: () => void): void;

  appendSelectedNodeId(id: string): void;
  appendSelectedNodeIds(appendedNodeIds: string[]): void;
  removeSelectedNodeId(id: string): void;
  removeSelectedNodeIds(unselectedNodeIds: string[]): void;
  subscribeToIsSelectedById(id: string, fn: () => void): void;
  unsubscribeToIsSelectedById(id: string, fn: () => void): void;

  getEdgeById(id: string): Types.Edge;
  getEdgesByNodeId(id: string): Types.Edge[];
  createEdge(edgeProps: Partial<Types.Edge>): Types.Edge | null;
  removeEdgeById(id: string): void;
  clearDraftEdgePath(): void;
  updateDraftEdgePath(x1: number, y1: number, x2: number, y2: number): void;
  subscribeToEdgesChange(id: string, fn: () => void): void;
  unsubscribeToEdgesChange(id: string, fn: () => void): void;

  import(graph: Types.Graph): void;
  export(): Types.Graph;
}

export { GraphManager };
