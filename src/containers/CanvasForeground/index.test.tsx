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

import {CanvasForeground} from "./index";

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

describe("CanvasForeground", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<CanvasForeground />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
