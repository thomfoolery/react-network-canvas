import React from "react";
import ReactDOM from "react-dom";
import {createElement} from "react";

import NodeCanvas from "../src/index";

const nodes = [
  {
    id: "504f852d-5b78-4f64-bd71-ab7f7f5dfb03",
    position: {
      x: 100,
      y: 100,
    },
    inputPorts: [
      {
        id: "02fa1df9-7187-4b85-ad00-6b14a1317cda",
      },
    ],
    outputPorts: [
      {
        id: "b09c894d-332f-4f16-843c-4bc42681972b",
      },
      {
        id: "37a08870-8f72-4724-b8d2-206c211a2787",
      },
    ],
  },
  {
    id: "b832f63f-0c6a-4977-8bb1-581f1c6cc1cb",
    position: {
      x: 300,
      y: 100,
    },
    inputPorts: [
      {
        id: "63f48da0-6495-4268-a55f-03f83af70720",
      },
    ],
    outputPorts: [
      {
        id: "793bd3a5-5b7e-407c-afcd-758592c702c8",
      },
      {
        id: "12d89e19-dc5f-40af-a3e2-50637e2f9b62",
      },
    ],
  },
  {
    id: "1c973de3-b2b8-49cc-843c-39a600843ec2",
    position: {
      x: 300,
      y: 300,
    },
    inputPorts: [
      {
        id: "b2ab0321-00a9-4be8-b5d5-a51cce615b4f",
      },
    ],
    outputPorts: [
      {
        id: "7fe5c462-062f-4bfe-bd7b-f191d9ed5e57",
      },
      {
        id: "2e817c94-2fae-4ea6-bfb8-503c6825f3c9",
      },
    ],
  },
];
const edges = [
  {
    id: "548633a2-47e8-4774-9031-3fcde1bba2be",
    from: {
      nodeId: "504f852d-5b78-4f64-bd71-ab7f7f5dfb03",
      portId: "b09c894d-332f-4f16-843c-4bc42681972b",
    },
    to: {
      nodeId: "b832f63f-0c6a-4977-8bb1-581f1c6cc1cb",
      portId: "63f48da0-6495-4268-a55f-03f83af70720",
    },
  },
  {
    id: "60122c7b-698c-443c-a29c-d80f5aba2837",
    from: {
      nodeId: "504f852d-5b78-4f64-bd71-ab7f7f5dfb03",
      portId: "37a08870-8f72-4724-b8d2-206c211a2787",
    },
    to: {
      nodeId: "1c973de3-b2b8-49cc-843c-39a600843ec2",
      portId: "b2ab0321-00a9-4be8-b5d5-a51cce615b4f",
    },
  },
];

function App() {
  return <NodeCanvas nodes={nodes} edges={edges} />;
}

ReactDOM.render(createElement(App), document.getElementById("app"));
