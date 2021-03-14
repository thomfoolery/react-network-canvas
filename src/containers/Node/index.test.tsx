import React from "react";
import renderer from "react-test-renderer";
import {
  mockDragManager,
  mockGraphManager,
  mockWorkspace,
  mockOptions,
  mockBridge,
} from "@component/utils/mocks";
import {
  useDragManager,
  useGraphManager,
  useWorkspace,
  useOptions,
  useBridge,
} from "@component/hooks";

import {Node} from "./index";

jest.mock("@component/hooks", () => ({
  useDragManager: jest.fn(),
  useGraphManager: jest.fn(),
  useWorkspace: jest.fn(),
  useOptions: jest.fn(),
  useBridge: jest.fn(),
}));

useDragManager.mockImplementation(() => mockDragManager());
useGraphManager.mockImplementation(() => mockGraphManager());
useWorkspace.mockImplementation(() => mockWorkspace());
useOptions.mockImplementation(() => mockOptions());
useBridge.mockImplementation(() => mockBridge());

describe("Node", () => {
  it("renders correctly", () => {
    const key = "node-1";
    const node = {
      id: "node-1",
      position: {
        x: 0,
        y: 0,
      },
      inputPorts: [{id: "node-1-input-1"}],
      outputPorts: [{id: "node-1-output-1"}],
    };
    const tree = renderer.create(<Node key={key} node={node} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
