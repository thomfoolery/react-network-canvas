interface Bridge {
  onClickCanvas(event, position, graphManager): void;
  onClickPort(event, port, graphManager): void;
  onKeyPress(event, key, graphManager): void;
}

export {Bridge};
