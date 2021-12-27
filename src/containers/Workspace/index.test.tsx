import React from "react";
import renderer from "react-test-renderer";

import {
  mockUseOptions,
  mockUseDragManager,
  mockUseGraphManager,
} from "@component/utils/mocks";
import { useOptions, useDragManager, useGraphManager } from "@component/hooks";

import { Workspace } from "./index";

jest.mock("@component/hooks", () => {
  return {
    ...jest.requireActual("@component/hooks"),
    useGraphManager: jest.fn(),
    useDragManager: jest.fn(),
    useOptions: jest.fn(),
  };
});

useGraphManager.mockImplementation(mockUseGraphManager());
useDragManager.mockImplementation(mockUseDragManager());
useOptions.mockImplementation(mockUseOptions());

it("renders correctly", () => {
  const tree = renderer.create(<Workspace />).toJSON();

  expect(tree).toMatchSnapshot();
});
