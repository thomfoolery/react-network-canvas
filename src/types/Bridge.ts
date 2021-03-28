import React from "react";
import * as Types from "@component/types";

interface GraphEvent {
  action:
    | "CREATE_NODE"
    | "UPDATE_NODE"
    | "DELETE_NODE"
    | "CREATE_EDGE"
    | "UPDATE_EDGE"
    | "DELETE_EDGE";
  subject: Types.Node | Types.Edge;
  graph: Types.Graph;
}

interface Bridge {
  connect(graphManager: Types.GraphManager): void;
  onChangeZoom(zoom: number): void;
  onMutateGraph(graphEvent: GraphEvent): void;
  onClickCanvas(
    event: React.SyntheticEvent,
    position: Types.Position,
    graphManager: Types.GraphManager
  ): void;
  onClickNode(
    event: React.SyntheticEvent,
    node: Types.Node,
    graphManager: Types.GraphManager
  ): void;
  onClickPort(
    event: React.SyntheticEvent,
    port: Types.Port,
    node: Types.Node,
    graphManager: Types.GraphManager
  ): void;
  onDropCanvas(
    event: React.SyntheticEvent,
    position: Types.Position,
    graphManager: Types.GraphManager
  ): void;
  onChangeSelectedNodeIds(
    selectedNodesIds: string[],
    graphManager: Types.GraphManager
  ): void;
  onKeyPress(
    event: React.SyntheticEvent,
    key: string,
    graphManager: Types.GraphManager
  ): void;
}

export {Bridge};
