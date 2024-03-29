# Network Canvas - React Component

<img width="100%" src="https://user-images.githubusercontent.com/188110/111397008-a9633680-8696-11eb-8353-b4adab63b57f.png">

![GitHub](https://img.shields.io/github/license/thomfoolery/react-network-canvas)
![GitHub package.json version](https://img.shields.io/github/package-json/v/thomfoolery/react-network-canvas)

This react component provides a visual canvas and api for creating, editing, importing and exporting directed network graphs.

Network diagrams are useful for modeling things such as audio synthesis, execution flow, render pipelines, scene graphs, data transformations, and many others.

This component aspires to be completely themeable and customizable in behavior and styles, but this is an ongoing effort.

## How to use

Install with yarn

```
yarn add react-network-canvas
```

Install with NPM

```
npm install react-network-canvas
```

Render in application

```jsx
import React from "react";
import { NetworkCanvas } from "react-network-canvas";

function MyApp() {
  return (
    <NetworkCanvas
      nodes={nodes}
      edges={edges}
      theme={theme}
      callbacks={callbacks}
      options={options}
    />
  );
}

export { MyApp };
```

## Demos

[StackBlitz ⚡️ Demos](https://stackblitz.com/edit/github-6yd6p4?embed=1&hideExplorer=1&view=preview)

### Example Code

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { createElement } from "react";
import { v1 as generateUuid } from "uuid";

import { NetworkCanvas } from "react-network-canvas";

import { nodes, edges } from "./graph.json";

function App() {
  const callbacks = {
    onClickCanvas(event, position, graphManager) {
      // create node at click position
      const node = graphManager.createNode({
        position,
        inputPorts: [{ id: generateUuid() }],
        outputPorts: [{ id: generateUuid() }, { id: generateUuid() }],
      });

      // select the newly created node
      graphManager.selectedNodeIds = [node.id];
    },
    onClickPort(event, port, parentNode, graphManager) {
      // create a connected node...
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
    isSnapToGridEnabled: true,
  };

  return (
    <NetworkCanvas
      nodes={nodes}
      edges={edges}
      options={options}
      {...callbacks}
    />
  );
}

ReactDOM.render(createElement(App), document.getElementById("app"));
```

### Example Graph Model

```json
{
  "nodes": [
    {
      "id": "504f852d-5b78-4f64-bd71-ab7f7f5dfb03",
      "data": {
        "foo": "bar"
      },
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
      "data": {
        "foo": "bar"
      },
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
      "data": {
        "foo": "bar"
      },
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

## Component Props

```ts
interface Props {
  nodes: Types.Node[];
  edges: Types.Edge[];
  callbacks?: Types.Bridge;
  options?: Types.Options;
  theme?: any;
}
```

## Options

```ts
interface Options {
  gridSize: number;
  canvasSize: number;
  isSnapToGridEnabled: boolean;
  startAtCanvasCenter: boolean;
  canvasMargin: number;
  zoomSensitivity: number;
  initialPanOffset: Types.Position;
  selectBoxKey?: "Shift" | "Control" | "Alt" | "Meta";
  zoomWheelKey?: "Shift" | "Control" | "Alt" | "Meta";
  maxZoom: number;
  minZoom: number;
  NodeComponent: ReactComponent;
  PortComponent: ReactComponent;
  SvgEdgeMarkersDefs: ReactComponent;
}

const DEFAULT_OPTIONS: Types.Options = {
  gridSize: 10,
  canvasSize: 2000,
  isSnapToGridEnabled: false,
  startAtCanvasCenter: true,
  canvasMargin: 50,
  initialPanOffset: { x: 50, y: 50 },
  zoomSensitivity: 0.001,
  zoomWheelKey: undefined,
  selectBoxKey: "Shift",
  maxZoom: Infinity,
  minZoom: 0,
  NodeComponent,
  PortComponent,
  SvgEdgeMarkersDefs,
};

const DEFAULT_THEME = {
  workspace: {
    backgroundSize: "",
    backgroundImage: "",
    backgroundColor: "#f6f6f6",
  },
  canvas: {
    borderRadius: "5px",
    boxShadow: "0 0 0 1px lightgrey",
    backgroundColor: "white",
    backgroundSize: "var(--NC-grid-size) var(--NC-grid-size)",
    backgroundImage:
      "radial-gradient(lightgray, lightgray 1px, transparent 1px)",
    backgroundPosition: "50% 50%",
  },
  selectbox: {
    backgroundColor: "rgba(100, 148, 237, 0.25)",
    boxShadow: "0 0 0 1px cornflowerblue",
  },
  edge: {
    stroke: "black",
    strokeWidth: "3px",
    hover: {
      stroke: "red",
    },
    draft: {
      stroke: "black",
    },
  },
};
```

### API Bridge

```ts
interface Bridge {
  connect(graphManager: Types.GraphManager): void;
  onChangeZoom(zoom: number): void;
  onMutateGraph(graphEvent: GraphEvent): void;
  onClickCanvas(
    event: React.SyntheticEvent,
    position: Types.Position,
    graphManager: Types.GraphManager
  ): void;
  onClickNode(
    event: React.SyntheticEvent,
    node: Types.Node,
    graphManager: Types.GraphManager
  ): void;
  onClickPort(
    event: React.SyntheticEvent,
    port: Types.Port,
    node: Types.Node,
    graphManager: Types.GraphManager
  ): void;
  onDropCanvas(
    event: React.SyntheticEvent,
    position: Types.Position,
    graphManager: Types.GraphManager
  ): void;
  onChangeSelectedNodeIds(
    selectedNodesIds: string[],
    graphManager: Types.GraphManager
  ): void;
  onKeyPress(
    event: React.SyntheticEvent,
    key: string,
    graphManager: Types.GraphManager
  ): void;
}
```

### GraphManager

```ts
interface GraphManager {
  nodes: Types.Node[];
  edges: Types.Edge[];
  callbacks: Types.Bridge;
  workspace: Types.Workspace | undefined;
  dragManager: Types.DragManager;
  selectedNodeIds: string[];

  getNodeById(id: string): Types.Node;
  getNodesByEdgeId(id: string): { from?: Types.Node; to?: Types.Node };
  createNode(nodeProps: Partial<Types.Node>): Types.Node | null;
  removeNodeById(id: string): void;
  removeNodesByIds(removedNodeIds: string[]): void;
  subscribeToNodesChange(fn: () => void): void;
  unsubscribeToNodesChange(fn: () => void): void;

  handleDragMove(event, dragDelta: Types.Position, dragData: any): void;
  handleDragEnd(event, dragDelta: Types.Position, dragData: any): void;
  updateNodePositionById(id: string, dragDelta: Types.Position): void;
  subscribeToDragDeltaById(id: string, fn: () => void): void;
  unsubscribeToDragDeltaById(id: string, fn: () => void): void;
  subscribeToNodePositionChangeById(id: string, fn: () => void): void;
  unsubscribeToNodePositionChangeById(id: string, fn: () => void): void;

  appendSelectedNodeId(id: string): void;
  appendSelectedNodeIds(appendedNodeIds: string[]): void;
  removeSelectedNodeId(id: string): void;
  removeSelectedNodeIds(unselectedNodeIds: string[]): void;
  subscribeToIsSelectedById(id: string, fn: () => void): void;
  unsubscribeToIsSelectedById(id: string, fn: () => void): void;

  getEdgeById(id: string): Types.Edge;
  getEdgesByNodeId(id: string): Types.Edge[];
  createEdge(edgeProps: Partial<Types.Edge>): Types.Edge | null;
  removeEdgeById(id: string): void;
  clearDraftEdgePath(): void;
  updateDraftEdgePath(x1: number, y1: number, x2: number, y2: number): void;
  subscribeToEdgesChange(id: string, fn: () => void): void;
  unsubscribeToEdgesChange(id: string, fn: () => void): void;

  import(graph: Types.Graph): void;
  export(): Types.Graph;
}
```

### Workspace

```ts
interface Workspace {
  setPan(position: Position | ((position: Position) => Position)): void;
  setZoom(zoom: number | ((zoom: number) => number)): void;
  container?: HTMLDivElement;
  isSelectBoxKeyDown: boolean;
  getElementDimensions(HTMLElement): { width: number; height: number };
  getCanvasPosition(object: HTMLElement | DOMRect | MouseEvent): Position;
  mountContextScreenOffset: Position;
  panZoom: {
    zoom: number;
  } & Position;
}
```
