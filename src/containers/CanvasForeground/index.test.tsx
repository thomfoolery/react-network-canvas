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

import {CanvasForeground} from "./index";

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

describe("CanvasForeground", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<CanvasForeground />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
