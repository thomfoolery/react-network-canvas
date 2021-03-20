import * as Types from "component/types";

function validateEdge(edge: Types.Edge, edges: Types.Edge[]): void {
  if (!edge.id) {
    throw Error("Edge is missing 'id' property");
  }

  if (!edge.from) {
    throw Error("Edge is missing 'from' properties");
  } else if (!edge.from.nodeId) {
    throw Error("Edge is missing 'from.nodeId' property");
  } else if (!edge.from.portId) {
    throw Error("Edge is missing 'from.portId' property");
  }

  if (!edge.to) {
    throw Error("Edge is missing 'to' properties");
  } else if (!edge.to.nodeId) {
    throw Error("Edge is missing 'to.nodeId' property");
  } else if (!edge.to.portId) {
    throw Error("Edge is missing 'to.portId' property");
  }

  const existingEdge = edges.find((edgeProps) => {
    if (edge.id === edgeProps.id) {
      return true;
    } else if (
      edge.from.nodeId === edgeProps.from.nodeId &&
      edge.from.portId === edgeProps.from.portId &&
      edge.to.nodeId === edgeProps.to.nodeId &&
      edge.to.portId === edgeProps.to.portId
    ) {
      return true;
    }
    return false;
  });

  if (existingEdge && edge.id === existingEdge.id) {
    throw Error("Edge with this 'id' already exists");
  } else if (existingEdge) {
    throw Error("This edge is a duplicate");
  }
}

export {validateEdge};
