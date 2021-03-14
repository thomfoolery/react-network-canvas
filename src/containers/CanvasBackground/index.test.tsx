import React from "react";
import renderer from "react-test-renderer";
import {
  mockUseDragManager,
  mockUseGraphManager,
  mockUseWorkspace,
  mockUseBridge,
} from "@component/utils/mocks";
import {
  useDragManager,
  useGraphManager,
  useWorkspace,
  useBridge,
} from "@component/hooks";

import {CanvasBackground} from "./index";

jest.mock("@component/hooks", () => ({
  ...jest.requireActual("@component/hooks"),
  useDragManager: jest.fn(),
  useGraphManager: jest.fn(),
  useWorkspace: jest.fn(),
  useBridge: jest.fn(),
}));

useDragManager.mockImplementation(mockUseDragManager());
useGraphManager.mockImplementation(mockUseGraphManager());
useWorkspace.mockImplementation(mockUseWorkspace());
useBridge.mockImplementation(mockUseBridge());

describe("CanvasBackground", () => {
  it("renders correctly", () => {
    const transform = `translate3d(100px, 100px, 0) scale(1)`;
    const tree = renderer
      .create(<CanvasBackground transform={transform} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
