import React from "react";
import renderer from "react-test-renderer";
import {
  mockDragManager,
  mockGraphManager,
  mockWorkspace,
  mockBridge,
} from "@component/utils/mocks";
import {
  useDragManager,
  useGraphManager,
  useWorkspace,
  useBridge,
} from "@component/hooks";

import {Edge} from "./index";

jest.mock("@component/hooks", () => ({
  useDragManager: jest.fn(),
  useGraphManager: jest.fn(),
  useWorkspace: jest.fn(),
  useBridge: jest.fn(),
}));

useDragManager.mockImplementation(() => mockDragManager());
useGraphManager.mockImplementation(() => mockGraphManager());
useWorkspace.mockImplementation(() => mockWorkspace());
useBridge.mockImplementation(() => mockBridge());

describe("Edge", () => {
  it("renders correctly", () => {
    const key = "edge-1";
    const edge = {
      id: "edge-1",
      from: {
        nodeId: "node-1",
        portId: "node-1-output-1",
      },
      to: {
        nodeId: "node-2",
        portId: "node-2-input-1",
      },
    };
    const isDraft = false;
    const tree = renderer
      .create(<Edge key={key} edge={edge} isDraft={isDraft} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
