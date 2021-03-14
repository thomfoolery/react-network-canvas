import React from "react";
import renderer from "react-test-renderer";

import {Port} from "./index";

describe("Port", () => {
  it("renders correctly", () => {
    const node = {
      id: "node-1",
      position: {
        x: 0,
        y: 0,
      },
      inputPorts: [{id: "node-1-input-1"}],
      outputPorts: [{id: "node-1-output-1"}],
    };
    const port = {id: "node-1-input-1"};
    const type = "input";
    const onMouseUp = () => null;
    const onMouseDown = () => null;

    const tree = renderer
      .create(
        <Port
          node={node}
          port={port}
          type={type}
          onMouseUp={onMouseUp}
          onMouseDown={onMouseDown}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
