import React from "react";
import Workspace from "./components/Workspace";
import {DragManagerProvider, GraphManagerProvider} from "./hooks";

interface Props {
  nodes: any[];
  edges: any[];
}

function NodeCanvas(props: Props) {
  const {nodes, edges} = props;

  return (
    <DragManagerProvider>
      <GraphManagerProvider nodes={nodes} edges={edges}>
        <Workspace />
      </GraphManagerProvider>
    </DragManagerProvider>
  );
}

export default NodeCanvas;
