interface Bridge {
  onClickCanvas(event, position, graphManager): void;
  onClickPort(event, port, node, graphManager): void;
  onKeyPress(event, key, graphManager): void;
}

export {Bridge};
