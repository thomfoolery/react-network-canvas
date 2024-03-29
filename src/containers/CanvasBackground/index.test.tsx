import React from "react";
import renderer from "react-test-renderer";
import { render, fireEvent, screen } from "@testing-library/react";

import {
  mockUseDragManager,
  mockUseGraphManager,
  mockUseWorkspace,
  mockUseCallbacks,
} from "@component/utils/mocks";
import {
  createCallbacks,
  createDragManager,
  createGraphManager,
} from "@component/utils";
import {
  useDragManager,
  useGraphManager,
  useWorkspace,
  useCallbacks,
} from "@component/hooks";

import { CanvasBackground } from "./index";

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

const defaultProps = {
  transform: "translate3d(100px, 100px, 0) scale(1)",
};

describe("CanvasBackground", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<CanvasBackground {...defaultProps} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("sets dragManager.dragData.source to 'panzoom' onMouseDown", () => {
    const dragDataSetter = jest.fn();
    const dragManager = createDragManager();

    // override the value property definition with our mocked setter
    Object.defineProperty(dragManager, "dragData", {
      set: dragDataSetter,
      configurable: true,
    });

    useDragManager.mockImplementation(mockUseDragManager(dragManager));

    render(<CanvasBackground {...defaultProps} />);

    fireEvent.mouseDown(screen.queryByTestId("CanvasBackground"));
    expect(dragDataSetter).toHaveBeenCalledWith({
      source: "panzoom",
    });
  });

  it("sets graphManager.selectedNodeIds to [] onMouseUp if graphManager.selectedNodeIds.length > 0", () => {
    const dragDataSetter = jest.fn();
    const graphManager = createGraphManager();

    const selectedNodeIdsSetter = jest.fn();

    // override the value property definition with our mocked setter
    Object.defineProperty(graphManager, "selectedNodeIds", {
      get: () => ["node-1", "node-2"],
      set: selectedNodeIdsSetter,
      configurable: true,
    });

    useGraphManager.mockImplementation(mockUseGraphManager(graphManager));

    render(<CanvasBackground {...defaultProps} />);

    fireEvent.mouseUp(screen.queryByTestId("CanvasBackground"));
    expect(selectedNodeIdsSetter).toHaveBeenCalledWith([]);
  });

  it("sets graphManager.selectedNodeIds to [] onMouseUp if isClick", () => {
    const dragDataSetter = jest.fn();
    const graphManager = createGraphManager();
    const dragManager = createDragManager();
    const callbacks = createCallbacks();

    const onClickCanvas = jest.fn();

    // override the value property definition with our mocked setter
    Object.defineProperty(graphManager, "selectedNodeIds", {
      get: () => [],
      configurable: true,
    });

    Object.defineProperty(dragManager, "dragDelta", {
      get: () => ({ x: 0, y: 0 }),
      configurable: true,
    });

    callbacks.onClickCanvas = onClickCanvas;

    useGraphManager.mockImplementation(mockUseGraphManager(graphManager));
    useDragManager.mockImplementation(mockUseDragManager(dragManager));
    useCallbacks.mockImplementation(mockUseCallbacks(callbacks));

    render(<CanvasBackground {...defaultProps} />);

    fireEvent.mouseUp(screen.queryByTestId("CanvasBackground"));
    expect(onClickCanvas).toHaveBeenCalledWith(
      expect.anything(),
      { x: 0, y: 0 },
      graphManager
    );
  });
});
