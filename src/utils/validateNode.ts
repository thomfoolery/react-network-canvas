import * as Types from "component/types";

function validateNode(node: Types.Node, nodes: Types.Node[]): void {
  if (!node.id) {
    throw Error("Node is missing 'id' property");
  }
  if (!node.position) {
    throw Error("Node is missing 'position' property");
  }
  if (!node.position.x) {
    throw Error("Node is missing 'position.x' property");
  }
  if (!node.position.y) {
    throw Error("Node is missing 'position.y' property");
  }
  if (!node.inputPorts) {
    throw Error("Node is missing 'node.inputPorts' property");
  }
  if (!node.outputPorts) {
    throw Error("Node is missing 'node.outputPorts' property");
  }

  const existingNode = nodes.find((nodeProps) => {
    if (node.id === nodeProps.id) {
      return true;
    }
    return false;
  });

  if (existingNode && node.id === existingNode.id) {
    throw Error("Node with this 'id' already exists");
  }
}

export {validateNode};
