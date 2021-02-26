import React, {memo, useState, useEffect} from "react";
import Node from "@app/components/Node";

import {useGraphManager} from "@app/hooks";

function Foreground() {
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

export default memo(Foreground);
