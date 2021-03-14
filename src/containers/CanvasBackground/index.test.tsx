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

import {CanvasBackground} from "./index";

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

describe("CanvasBackground", () => {
  it("renders correctly", () => {
    const transform = `translate3d(100px, 100px, 0) scale(1)`;
    const tree = renderer
      .create(<CanvasBackground transform={transform} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
