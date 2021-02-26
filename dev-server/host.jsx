import React, {useEffect} from "react";
import ReactDOM from "react-dom";
import {createElement} from "react";

import NodeCanvas from "../src/index";

import graph from "./public/graph.json";

function App() {
  const {nodes, edges} = graph;
  const bridge = {
    onClickCanvas(event, position, graphManager) {
      const node = graphManager.createNode({position});

      graphManager.selectedNodeIds = [node.id];
    },
    onClickPort(event, port, parentNode, graphManager) {
      const parentNodeElement = document.querySelector(
        `#Node-${parentNode.id}`
      );
      const BB = parentNodeElement.getBoundingClientRect();
      const position = {
        x: BB.left + BB.width + 50,
        y: BB.top,
      };
      const node = graphManager.createNode({position});

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
    },
    onKeyPress(event, key, graphManager) {
      if (key === "Backspace" && graphManager.selectedNodeIds.length > 0) {
        graphManager.removeNodesByIds(graphManager.selectedNodeIds);
      }
    },
  };

  return <NodeCanvas nodes={nodes} edges={edges} bridge={bridge} />;
}

ReactDOM.render(createElement(App), document.getElementById("app"));
