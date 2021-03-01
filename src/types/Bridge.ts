import React from "react";
import * as Types from "@app/types";

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
  connect(graphEvent: GraphEvent): void;
  onUpdateGraph(graphEvent: GraphEvent): void;
  onClickCanvas(
    event: React.SyntheticEvent,
    position: Types.Position,
    graphManager: any
  ): void;
  onClickPort(
    event: React.SyntheticEvent,
    port: Types.Port,
    node: Types.Node,
    graphManager: any
  ): void;
  onKeyPress(event: React.SyntheticEvent, key: string, graphManager: any): void;
}

export {Bridge};
