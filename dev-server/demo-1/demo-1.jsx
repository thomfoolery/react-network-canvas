import React, { useCallback } from "react";
import ReactDOM from "react-dom";
import { createElement } from "react";
import { v1 as generateUuid } from "uuid";

import { NetworkCanvas } from "@component";

import initialGraph from "./graph-1.json";

function App() {
  const onClickCanvas = useCallback((event, position, graphManager) => {
    const node = graphManager.createNode({
      position,
      inputPorts: [{ id: generateUuid() }],
      outputPorts: [{ id: generateUuid() }, { id: generateUuid() }],
    });

    graphManager.selectedNodeIds = [node.id];
  }, []);

  const onClickPort = useCallback((event, port, parentNode, graphManager) => {
    const parentNodeElement = document.querySelector(`#Node-${parentNode.id}`);
    const edgesOut = graphManager
      .getEdgesByNodeId(parentNode.id)
      .filter(({ from }) => from.nodeId === parentNode.id);

    const BCR = parentNodeElement.getBoundingClientRect();
    const nodeDimensions =
      graphManager.workspace.getElementDimensions(parentNodeElement);
    const initialPosition = graphManager.workspace.getCanvasPosition(BCR);
    const position = edgesOut.reduce(
      (acc, edge) => {
        const nodeElement = document.querySelector(`#Node-${edge.to.nodeId}`);
        const BCR = nodeElement.getBoundingClientRect();
        const nodeDimensions =
          graphManager.workspace.getElementDimensions(nodeElement);
        const position = graphManager.workspace.getCanvasPosition(BCR);

        if (position.y >= acc.y) {
          return {
            ...acc,
            y: position.y + nodeDimensions.height + 20,
          };
        }
        return acc;
      },
      {
        x: initialPosition.x + nodeDimensions.width + 50,
        y: initialPosition.y,
      }
    );

    const node = graphManager.createNode({
      position,
      inputPorts: [{ id: generateUuid() }],
      outputPorts: [{ id: generateUuid() }],
    });

    graphManager.createEdge({
      from: {
        nodeId: parentNode.id,
        portId: port.id,
      },
      to: {
        nodeId: node.id,
        portId: node.inputPorts[0].id,
      },
    });
    graphManager.selectedNodeIds = [node.id];
  }, []);

  const onKeyPress = useCallback((event, key, graphManager) => {
    if (key === "Backspace" && graphManager.selectedNodeIds.length > 0) {
      graphManager.removeNodesByIds(graphManager.selectedNodeIds);
    }
  }, []);

  return (
    <>
      <div className="demo">
        <NetworkCanvas
          initialGraph={initialGraph}
          onKeyPress={onKeyPress}
          onClickPort={onClickPort}
          onClickCanvas={onClickCanvas}
        />
      </div>
      <div className="demo">
        <NetworkCanvas
          initialGraph={{ nodes: [], edges: [] }}
          onKeyPress={onKeyPress}
          onClickPort={onClickPort}
          onClickCanvas={onClickCanvas}
        />
      </div>
    </>
  );
}

ReactDOM.render(createElement(App), document.getElementById("app"));
