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
  createWorkspace,
  useDragManager,
  useGraphManager,
  useWorkspace,
  useBridge,
} from "@component/hooks";

import {Canvas} from "./index";

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
  transform: `translate3d(100px, 100px, 0) scale(1)`,
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

describe("Canvas", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Canvas {...defaultProps} />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("sets graphManager.selectedNodeIds to empty array onMouseDown if type == output", () => {
    const dragDataSetter = jest.fn();
    const isSelectBoxKeyDownGetter = jest.fn(() => true);
    const dragManager = createDragManager();
    const workspace = createWorkspace(mockWorkspace);

    // override the value property definition with our mocked setter
    Object.defineProperty(dragManager, "dragData", {
      set: dragDataSetter,
      configurable: true,
    });

    Object.defineProperty(workspace, "isSelectBoxKeyDown", {
      get: isSelectBoxKeyDownGetter,
      configurable: true,
    });

    useDragManager.mockImplementation(mockUseDragManager(dragManager));
    useWorkspace.mockImplementation(mockUseWorkspace(workspace));

    render(<Canvas {...defaultProps} />);

    fireEvent.mouseDown(screen.queryByTestId("Canvas"));
    expect(dragDataSetter).toHaveBeenCalledWith({
      type: "selectbox",
      startPosition: {x: 0, y: 0},
    });
  });

  it("sets style props on SelectBox onDragMove if dragData.type === selectbox", async () => {
    const dragManager = createDragManager();

    dragManager.dragData = {
      type: "selectbox",
      startPosition: {
        x: 0,
        y: 0,
      },
    };

    useDragManager.mockImplementation(mockUseDragManager(dragManager));

    render(<Canvas {...defaultProps} />);

    dragManager.handleDragStart({
      screenX: 0,
      screenY: 0,
      currentTarget: {
        addEventListener() {},
      },
    });

    dragManager.handleDragMove({
      screenX: 100,
      screenY: 100,
    });

    expect(screen.queryByTestId("SelectBox")).toHaveStyle(`
      left: 0px;
      top: 0px;
      width: 100px;
      height: 100px;
      opacity: 1;
    `);
  });

  it("clear style props on SelectBox onDragEnd if dragData.type === selectbox && !isClick", async () => {
    const dragManager = createDragManager();

    dragManager.dragData = {
      type: "selectbox",
      startPosition: {
        x: 0,
        y: 0,
      },
    };

    useDragManager.mockImplementation(mockUseDragManager(dragManager));

    render(<Canvas {...defaultProps} />);

    dragManager.handleDragStart({
      screenX: 0,
      screenY: 0,
      currentTarget: {
        addEventListener() {},
      },
    });

    dragManager.handleDragMove({
      screenX: 100,
      screenY: 100,
    });

    dragManager.handleDragEnd({
      screenX: 100,
      screenY: 100,
      currentTarget: {
        removeEventListener() {},
      },
    });

    expect(screen.queryByTestId("SelectBox")).not.toHaveStyle(`
      left: 0px;
      top: 0px;
      width: 100px;
      height: 100px;
      opacity: 1;
    `);
  });

  it("calls graphManager.selectedNodeIds with the node ids inside the selectbox boundary", () => {
    const graphManager = createGraphManager();
    const dragManager = createDragManager();

    const selectedNodeIdsSetter = jest.fn();

    dragManager.dragData = {
      type: "selectbox",
      startPosition: {
        x: 0,
        y: 0,
      },
    };

    Object.defineProperty(graphManager, "selectedNodeIds", {
      set: selectedNodeIdsSetter,
      configurable: true,
    });

    useGraphManager.mockImplementation(mockUseGraphManager(graphManager));
    useDragManager.mockImplementation(mockUseDragManager(dragManager));

    render(<Canvas {...defaultProps} />);

    dragManager.handleDragStart({
      screenX: 0,
      screenY: 0,
      currentTarget: {
        addEventListener() {},
      },
    });

    dragManager.handleDragMove({
      screenX: 100,
      screenY: 100,
    });

    dragManager.handleDragEnd({
      screenX: 100,
      screenY: 100,
      currentTarget: {
        removeEventListener() {},
      },
    });

    expect(selectedNodeIdsSetter).toHaveBeenCalled();
  });
});
