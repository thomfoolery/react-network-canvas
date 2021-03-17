import React from "react";
import renderer from "react-test-renderer";
import {render, fireEvent, screen} from "@testing-library/react";
import {
  mockUseDragManager,
  mockUseGraphManager,
  mockUseWorkspace,
  mockUseBridge,
} from "@component/utils/mocks";
import {
  createGraphManager,
  createDragManager,
  createBridge,
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

  it("sets dragManager.dragData.type to 'panzoom' onMouseDown", () => {
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
      type: "panzoom",
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
    const bridge = createBridge();

    const onClickCanvas = jest.fn();

    // override the value property definition with our mocked setter
    Object.defineProperty(graphManager, "selectedNodeIds", {
      get: () => [],
      configurable: true,
    });

    Object.defineProperty(dragManager, "dragDelta", {
      get: () => ({x: 0, y: 0}),
      configurable: true,
    });

    bridge.onClickCanvas = onClickCanvas;

    useGraphManager.mockImplementation(mockUseGraphManager(graphManager));
    useDragManager.mockImplementation(mockUseDragManager(dragManager));
    useBridge.mockImplementation(mockUseBridge(bridge));

    render(<CanvasBackground {...defaultProps} />);

    fireEvent.mouseUp(screen.queryByTestId("CanvasBackground"));
    expect(onClickCanvas).toHaveBeenCalledWith(
      expect.anything(),
      {x: 0, y: 0},
      graphManager
    );
  });
});
