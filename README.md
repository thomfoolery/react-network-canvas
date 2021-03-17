# Network Canvas - React Component

This react component provides a visual canvas and api for creating, editing, importing and exporting directed, unweighted network diagrams.

Network diagrams are useful for modeling things such as execution audio synthesis, execution flows, render pipelines, scene graphs, data transformations, and many other things.

This component aspires to be completely customizable in behavior and styles, but this is an ongoing effort.

<img width="100%" src="https://user-images.githubusercontent.com/188110/111396785-2fcb4880-8696-11eb-86b1-57dab8659c60.png">

### Demo
https://user-images.githubusercontent.com/188110/111396711-09a5a880-8696-11eb-8c8c-607e139e5666.mov

### Example

```jsx
import React from "react";
import ReactDOM from "react-dom";
import {createElement} from "react";
import {v1 as generateUuid} from "uuid";

import {NodeCanvas} from "@component";

import {nodes, edges} from "./graph.json";

function App() {
  const {nodes, edges} = graph;
  const bridge = {
    onClickCanvas(event, position, graphManager) {
      // create node at click position
      const node = graphManager.createNode({
        position,
        outputPorts: [{id: generateUuid()}, {id: generateUuid()}],
      });

      // select the newly created node
      graphManager.selectedNodeIds = [node.id];
    },
    onClickPort(event, port, parentNode, graphManager) {
      // find the parent  node dom element
      const parentNodeElement = document.querySelector(
        `#Node-${parentNode.id}`
      );
      // get all of the nodes edges
      const edgesOut = graphManager
        .getEdgesByNodeId(parentNode.id)
        // filter edges to only edges connected to 'from' port
        .filter(({from}) => from.nodeId === parentNode.id);

      // get the bounding rectangle of the parent node
      const BCR = parentNodeElement.getBoundingClientRect();
      // get dom elements dimensions
      const nodeDimensions = graphManager.workspace.getElementDimensions(
        parentNodeElement
      );
      // get parent node canvas position
      const parentNodePosition = graphManager.workspace.getCanvasPosition(BCR);
      // calculate the postion of the newly created node
      const position = edgesOut.reduce(
        (acc, edge) => {
          const nodeElement = document.querySelector(`#Node-${edge.to.nodeId}`);
          const BCR = nodeElement.getBoundingClientRect();
          const nodeDimensions = graphManager.workspace.getElementDimensions(
            nodeElement
          );
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
          x: parentNodePosition.x + nodeDimensions.width + 50,
          y: parentNodePosition.y,
        }
      );

      // create a new node
      const node = graphManager.createNode({position});

      // create a new edge connecting the new node and the parent node
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
        // delete selected nodes
        graphManager.removeNodesByIds(graphManager.selectedNodeIds);
      }
    },
  };

  const options = {
    gridSize: 20,
    zoomWheelKey: "Shift",
    selectBoxKey: "Shift",
    isRoundToGridEnabled: true,
  };

  return (
    <NodeCanvas nodes={nodes} edges={edges} bridge={bridge} options={options} />
  );
}

ReactDOM.render(createElement(App), document.getElementById("app"));
```

### graph.json

```json
{
  "nodes": [
    {
      "id": "504f852d-5b78-4f64-bd71-ab7f7f5dfb03",
      "position": {
        "x": 100,
        "y": 100
      },
      "inputPorts": [
        {
          "id": "02fa1df9-7187-4b85-ad00-6b14a1317cda"
        }
      ],
      "outputPorts": [
        {
          "id": "b09c894d-332f-4f16-843c-4bc42681972b"
        },
        {
          "id": "37a08870-8f72-4724-b8d2-206c211a2787"
        }
      ]
    },
    {
      "id": "b832f63f-0c6a-4977-8bb1-581f1c6cc1cb",
      "position": {
        "x": 300,
        "y": 100
      },
      "inputPorts": [
        {
          "id": "63f48da0-6495-4268-a55f-03f83af70720"
        }
      ],
      "outputPorts": [
        {
          "id": "793bd3a5-5b7e-407c-afcd-758592c702c8"
        },
        {
          "id": "12d89e19-dc5f-40af-a3e2-50637e2f9b62"
        }
      ]
    },
    {
      "id": "1c973de3-b2b8-49cc-843c-39a600843ec2",
      "position": {
        "x": 300,
        "y": 200
      },
      "inputPorts": [
        {
          "id": "b2ab0321-00a9-4be8-b5d5-a51cce615b4f"
        }
      ],
      "outputPorts": [
        {
          "id": "7fe5c462-062f-4bfe-bd7b-f191d9ed5e57"
        },
        {
          "id": "2e817c94-2fae-4ea6-bfb8-503c6825f3c9"
        }
      ]
    }
  ],
  "edges": [
    {
      "id": "548633a2-47e8-4774-9031-3fcde1bba2be",
      "from": {
        "nodeId": "504f852d-5b78-4f64-bd71-ab7f7f5dfb03",
        "portId": "b09c894d-332f-4f16-843c-4bc42681972b"
      },
      "to": {
        "nodeId": "b832f63f-0c6a-4977-8bb1-581f1c6cc1cb",
        "portId": "63f48da0-6495-4268-a55f-03f83af70720"
      }
    },
    {
      "id": "60122c7b-698c-443c-a29c-d80f5aba2837",
      "from": {
        "nodeId": "504f852d-5b78-4f64-bd71-ab7f7f5dfb03",
        "portId": "37a08870-8f72-4724-b8d2-206c211a2787"
      },
      "to": {
        "nodeId": "1c973de3-b2b8-49cc-843c-39a600843ec2",
        "portId": "b2ab0321-00a9-4be8-b5d5-a51cce615b4f"
      }
    }
  ]
}
```
