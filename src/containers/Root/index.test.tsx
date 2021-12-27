import React from "react";
import renderer from "react-test-renderer";
import { createOptions } from "@component/hooks";

import { Root } from "./index";

it("renders correctly", () => {
  const nodes = [
    {
      id: "node-1",
      position: {
        x: 0,
        y: 0,
      },
      inputPorts: [{ id: "node-1-input-1" }],
      outputPorts: [{ id: "node-1-output-1" }],
    },
    {
      id: "node-2",
      position: {
        x: 100,
        y: 100,
      },
      inputPorts: [{ id: "node-2-input-1" }],
      outputPorts: [{ id: "node-2-output-1" }],
    },
  ];
  const edges = [
    {
      id: "edge-1",
      from: {
        nodeId: "node-1",
        portId: "node-1-output-1",
      },
      to: {
        nodeId: "node-2",
        portId: "node-2-input-1",
      },
    },
  ];
  const options = createOptions();
  const tree = renderer
    .create(<Root nodes={nodes} edges={edges} options={options} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
