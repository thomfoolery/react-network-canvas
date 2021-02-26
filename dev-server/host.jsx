import React, {useEffect} from "react";
import ReactDOM from "react-dom";
import {createElement} from "react";

import NodeCanvas from "../src/index";

import graph from "./public/graph.json";

function App() {
  const {nodes, edges} = graph;
  const bridge = {
    onClickCanvas(event, position, graphManager) {
      graphManager.createNode({position});
    },
    onClickPort(event, port, graphManager) {
      // console.log(event, port, graphManager);
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
