import React from "react";
import renderer from "react-test-renderer";
import { render, fireEvent, screen } from "@testing-library/react";
import {
  mockUseDragManager,
  mockUseGraphManager,
  mockUseWorkspace,
  mockUseOptions,
  mockUseCallbacks,
} from "@component/utils/mocks";
import {
  createGraphManager,
  createDragManager,
  createCallbacks,
  useDragManager,
  useGraphManager,
  useWorkspace,
  useOptions,
  useCallbacks,
} from "@component/hooks";

import { Port } from "./index";

jest.mock("@component/hooks", () => ({
  ...jest.requireActual("@component/hooks"),
  useDragManager: jest.fn(),
  useGraphManager: jest.fn(),
  useWorkspace: jest.fn(),
  useOptions: jest.fn(),
  useCallbacks: jest.fn(),
}));

useDragManager.mockImplementation(mockUseDragManager());
useGraphManager.mockImplementation(mockUseGraphManager());
useWorkspace.mockImplementation(mockUseWorkspace());
useOptions.mockImplementation(mockUseOptions());
useCallbacks.mockImplementation(mockUseCallbacks());

const defaultProps = {
  type: "input" as "input" | "output",
  key: "node-1-input-1",
  port: {
    id: "node-1-input-1",
    type: "input",
  },
  node: {
    id: "node-1",
    position: { x: 0, y: 0 },
    inputs: [{ id: "node-1-input-1" }],
    outputs: [{ id: "node-1-output-1" }],
  },
};

describe("Port", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Port {...defaultProps} />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("sets graphManager.selectedNodeIds to empty array onMouseDown if type == output", () => {
    const type = "output";
    const selectNodeIdsSetter = jest.fn();
    const graphManager = createGraphManager();

    // override the value property definition with our mocked setter
    Object.defineProperty(graphManager, "selectedNodeIds", {
      set: selectNodeIdsSetter,
      configurable: true,
    });

    useGraphManager.mockImplementation(mockUseGraphManager(graphManager));

    render(<Port {...defaultProps} type={type} />);

    fireEvent.mouseDown(screen.queryByTestId(defaultProps.port.id));
    expect(selectNodeIdsSetter).toHaveBeenCalledWith([]);
  });

  it("sets dragManager.dragData onMouseDown if type == output", () => {
    const type = "output";
    const dragDataSetter = jest.fn();
    const dragManager = createDragManager();

    // override the value property definition with our mocked setter
    Object.defineProperty(dragManager, "dragData", {
      set: dragDataSetter,
      configurable: true,
    });

    useDragManager.mockImplementation(mockUseDragManager(dragManager));

    render(<Port {...defaultProps} type={type} />);

    fireEvent.mouseDown(screen.queryByTestId(defaultProps.port.id));
    expect(dragDataSetter).toHaveBeenCalledWith({
      source: "port",
      port: {
        ...defaultProps.port,
        type,
        parentNode: defaultProps.node,
        position: {
          x: 0,
          y: 0,
        },
      },
    });
  });

  it("calls bridge.onClickPort onMouseUp if isClick", () => {
    const onClickPort = jest.fn();
    const dragDataGetter = jest.fn(() => ({ x: 0, y: 0 }));
    const dragManager = createDragManager();
    const bridge = createCallbacks();

    // override the value property definition with our mocked setter
    bridge.onClickPort = onClickPort;
    Object.defineProperty(dragManager, "dragDelta", {
      get: dragDataGetter,
      configurable: true,
    });

    useDragManager.mockImplementation(mockUseDragManager(dragManager));
    useCallbacks.mockImplementation(mockUseCallbacks(bridge));

    render(<Port {...defaultProps} />);

    fireEvent.mouseUp(screen.queryByTestId(defaultProps.port.id));
    expect(onClickPort).toHaveBeenCalled();
  });

  it("calls graphManager.createEdge onMouseUp if not isClick && dragData.port && type === input && dragData.port.type === output", () => {
    const dragDeltaGetter = jest.fn(() => ({ x: 10, y: 10 }));
    const dragDataGetter = jest.fn(() => ({
      port: {
        id: "node-1-output-1",
        type: "output",
        parentNode: {
          id: "node-1",
          position: { x: 0, y: 0 },
          inputs: [{ id: "node-1-input-1" }],
          outputs: [{ id: "node-1-output-1" }],
        },
      },
    }));
    const createEdge = jest.fn();
    const graphManager = createGraphManager();
    const dragManager = createDragManager();

    // override the value property definition with our mocked setter
    graphManager.createEdge = createEdge;
    Object.defineProperty(dragManager, "dragDelta", {
      get: dragDeltaGetter,
      configurable: true,
    });
    Object.defineProperty(dragManager, "dragData", {
      get: dragDataGetter,
      configurable: true,
    });

    useGraphManager.mockImplementation(mockUseGraphManager(graphManager));
    useDragManager.mockImplementation(mockUseDragManager(dragManager));

    render(<Port {...defaultProps} />);

    fireEvent.mouseUp(screen.queryByTestId(defaultProps.port.id));
    expect(createEdge).toHaveBeenCalled();
  });
});
