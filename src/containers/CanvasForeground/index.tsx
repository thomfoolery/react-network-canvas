import React, {memo, useState, useEffect} from "react";
import {Node} from "@app/containers";

import {useGraphManager} from "@app/hooks";

function Component() {
  const graphManager = useGraphManager();

  const [nodes, setNodes] = useState(graphManager.nodes);

  useEffect(() => {
    graphManager.subscribeToNodesChange(setNodes);
    return () => graphManager.unsubscribeToNodesChange(setNodes);
  }, [graphManager]);

  return (
    <>
      {nodes.map((node) => (
        <Node key={node.id} node={node} />
      ))}
    </>
  );
}

const CanvasForeground = memo(Component);

export {CanvasForeground};
