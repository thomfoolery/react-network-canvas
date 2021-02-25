import React from "react";
import Workspace from "./components/Workspace";
import {DragManagerProvider, GraphManagerProvider} from "./hooks";

interface Props {
  nodes: any[];
  edges: any[];
  canvasSize: number;
}

function NodeCanvas(props: Props) {
  const {nodes, edges, canvasSize = 2000} = props;
  const style = {
    "--canvas-size": `${canvasSize}px`,
  };

  return (
    <div style={style}>
      <DragManagerProvider>
        <GraphManagerProvider nodes={nodes} edges={edges}>
          <Workspace />
        </GraphManagerProvider>
      </DragManagerProvider>
    </div>
  );
}

export default NodeCanvas;
