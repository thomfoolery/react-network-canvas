import React, {useRef} from "react";
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
      console.log(event, port, graphManager);
    },
  };
  return <NodeCanvas nodes={nodes} edges={edges} bridge={bridge} />;
}

ReactDOM.render(createElement(App), document.getElementById("app"));
