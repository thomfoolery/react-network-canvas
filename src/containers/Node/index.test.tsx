import React from "react";
import renderer from "react-test-renderer";
import { render, fireEvent, screen } from "@testing-library/react";
import {
  mockUseDragManager,
  mockUseGraphManager,
  mockUseWorkspace,
  mockUseOptions,
  mockUseBridge,
} from "@component/utils/mocks";
import {
  createGraphManager,
  createDragManager,
  createWorkspace,
  createBridge,
  useDragManager,
  useGraphManager,
  useWorkspace,
  useOptions,
  useBridge,
} from "@component/hooks";

import { Node } from "./index";

jest.mock("@component/hooks", () => ({
  ...jest.requireActual("@component/hooks"),
  useDragManager: jest.fn(),
  useGraphManager: jest.fn(),
  useWorkspace: jest.fn(),
  useOptions: jest.fn(),
  useBridge: jest.fn(),
}));

useDragManager.mockImplementation(mockUseDragManager());
useGraphManager.mockImplementation(mockUseGraphManager());
useWorkspace.mockImplementation(mockUseWorkspace());
useOptions.mockImplementation(mockUseOptions());
useBridge.mockImplementation(mockUseBridge());
const defaultProps = {
  key: "node-1",
  node: {
    id: "node-1",
    position: {
      x: 0,
      y: 0,
    },
    inputPorts: [{ id: "node-1-input-1" }],
    outputPorts: [{ id: "node-1-output-1" }],
  },
};

const mockWorkspace = {
  panZoomRef: {
    current: {
      x: 0,
      y: 0,
      zoom: 1,
    },
  },
  workspaceDivRef: {
    current: document.createElement("div"),
  },
  isSelectBoxKeyDownRef: {
    current: false,
  },
  setPan() {},
  setZoom() {},
};

describe("Node", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Node {...defaultProps} />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("dragManager.dragData updated onMouseDown", () => {
    const dragManager = createDragManager();
    useDragManager.mockImplementation(mockUseDragManager(dragManager));

    render(<Node {...defaultProps} />);

    fireEvent.mouseDown(screen.queryByTestId(defaultProps.node.id));

    expect(dragManager.dragData.dragType).toBe("node");
    expect(dragManager.dragData.node).toBe(defaultProps.node);
  });

  it("selects node.id onMouseDown if selectbox key is not down && node is not already selected", () => {
    const workspace = createWorkspace(mockWorkspace);
    const graphManager = createGraphManager();
    const dragManager = createDragManager();
    const selectedNodeIdsSetter = jest.fn();

    Object.defineProperty(workspace, "isSelectBoxKeyDown", {
      get: () => false,
      configurable: true,
    });

    Object.defineProperty(graphManager, "selectedNodeIds", {
      get: () => [],
      set: selectedNodeIdsSetter,
      configurable: true,
    });

    useGraphManager.mockImplementation(mockUseDragManager(graphManager));
    useDragManager.mockImplementation(mockUseDragManager(dragManager));
    useWorkspace.mockImplementation(mockUseWorkspace(workspace));

    render(<Node {...defaultProps} />);

    fireEvent.mouseDown(screen.queryByTestId(defaultProps.node.id));

    expect(selectedNodeIdsSetter).toBeCalledWith([defaultProps.node.id]);
  });

  it("calls bridge.onClickNode onMouseUp if isClick === true", () => {
    const graphManager = createGraphManager();
    const dragManager = createDragManager();
    const bridge = createBridge();
    const onClickNode = jest.fn();

    bridge.onClickNode = onClickNode;

    Object.defineProperty(dragManager, "dragDelta", {
      get: () => ({ x: 0, y: 0 }),
      configurable: true,
    });

    useGraphManager.mockImplementation(mockUseDragManager(graphManager));
    useDragManager.mockImplementation(mockUseDragManager(dragManager));
    useBridge.mockImplementation(mockUseBridge(bridge));

    render(<Node {...defaultProps} />);

    fireEvent.mouseUp(screen.queryByTestId(defaultProps.node.id));

    expect(onClickNode).toHaveBeenCalledWith(
      expect.anything(),
      defaultProps.node,
      graphManager
    );
  });

  it("removes node.id from selectedNodeIds onMouseUp if node is already selected", () => {
    const workspace = createWorkspace(mockWorkspace);
    const graphManager = createGraphManager();
    const dragManager = createDragManager();
    const removeSelectedNodeId = jest.fn();

    Object.defineProperty(dragManager, "dragDelta", {
      get: () => ({ x: 0, y: 0 }),
      configurable: true,
    });

    Object.defineProperty(workspace, "isSelectBoxKeyDown", {
      get: () => true,
      configurable: true,
    });

    Object.defineProperty(graphManager, "selectedNodeIds", {
      get: () => [defaultProps.node.id],
      configurable: true,
    });

    graphManager.removeSelectedNodeId = removeSelectedNodeId;

    useGraphManager.mockImplementation(mockUseDragManager(graphManager));
    useDragManager.mockImplementation(mockUseDragManager(dragManager));
    useWorkspace.mockImplementation(mockUseWorkspace(workspace));

    render(<Node {...defaultProps} />);

    fireEvent.mouseUp(screen.queryByTestId(defaultProps.node.id));
    expect(removeSelectedNodeId).toHaveBeenCalledWith(defaultProps.node.id);
  });

  it("appends node.id from selectedNodeIds onMouseUp if node is not already selected", () => {
    const workspace = createWorkspace(mockWorkspace);
    const graphManager = createGraphManager();
    const dragManager = createDragManager();
    const appendSelectedNodeId = jest.fn();

    Object.defineProperty(dragManager, "dragDelta", {
      get: () => ({ x: 0, y: 0 }),
      configurable: true,
    });

    Object.defineProperty(workspace, "isSelectBoxKeyDown", {
      get: () => true,
      configurable: true,
    });

    Object.defineProperty(graphManager, "selectedNodeIds", {
      get: () => [],
      configurable: true,
    });

    graphManager.appendSelectedNodeId = appendSelectedNodeId;

    useGraphManager.mockImplementation(mockUseDragManager(graphManager));
    useDragManager.mockImplementation(mockUseDragManager(dragManager));
    useWorkspace.mockImplementation(mockUseWorkspace(workspace));

    render(<Node {...defaultProps} />);

    fireEvent.mouseUp(screen.queryByTestId(defaultProps.node.id));
    expect(appendSelectedNodeId).toHaveBeenCalledWith(defaultProps.node.id);
  });
});
