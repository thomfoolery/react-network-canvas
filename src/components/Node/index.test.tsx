import React from "react";
import renderer from "react-test-renderer";

import { Node } from "./index";

describe("Node", () => {
  it("renders correctly", () => {
    const node = {
      id: "node-1",
      position: {
        x: 0,
        y: 0,
      },
      inputPorts: [{ id: "node-1-input-1" }],
      outputPorts: [{ id: "node-1-output-1" }],
    };
    const position = { x: 0, y: 0 };
    const isSelected = false;
    const inputPorts = [{ id: "node-1-input-1" }];
    const outputPorts = [{ id: "node-1-output-1" }];
    const onMouseUp = () => null;
    const onMouseDown = () => null;
    const PortComponent = () => null;

    const tree = renderer
      .create(
        <Node
          node={node}
          position={position}
          isSelected={isSelected}
          inputPorts={inputPorts}
          outputPorts={outputPorts}
          onMouseUp={onMouseUp}
          onMouseDown={onMouseDown}
          PortComponent={PortComponent}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
