import React from "react";
import renderer from "react-test-renderer";
import {
  mockUseDragManager,
  mockUseGraphManager,
  mockUseWorkspace,
  mockUseCallbacks,
} from "@component/utils/mocks";
import {
  useDragManager,
  useGraphManager,
  useWorkspace,
  useCallbacks,
} from "@component/hooks";

import { CanvasForeground } from "./index";

jest.mock("@component/hooks", () => ({
  ...jest.requireActual("@component/hooks"),
  useDragManager: jest.fn(),
  useGraphManager: jest.fn(),
  useWorkspace: jest.fn(),
  useCallbacks: jest.fn(),
}));

useDragManager.mockImplementation(mockUseDragManager());
useGraphManager.mockImplementation(mockUseGraphManager());
useWorkspace.mockImplementation(mockUseWorkspace());
useCallbacks.mockImplementation(mockUseCallbacks());

describe("CanvasForeground", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<CanvasForeground />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
