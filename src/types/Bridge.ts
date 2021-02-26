interface Bridge {
  onClickCanvas(event, position, graphManager): void;
  onClickPort(event, port, graphManager): void;
}

export {Bridge};
