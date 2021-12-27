import React from "react";
import renderer from "react-test-renderer";
import { render, fireEvent, screen } from "@testing-library/react";
import {
  mockUseDragManager,
  mockUseGraphManager,
  mockUseWorkspace,
  mockUseBridge,
} from "@component/utils/mocks";
import {
  createGraphManager,
  useDragManager,
  useGraphManager,
  useWorkspace,
  useBridge,
} from "@component/hooks";

import { Edge } from "./index";

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
  key: "edge-1",
  edge: {
    id: "edge-1",
    from: {
      nodeId: "node-1",
      portId: "node-1-output-1",
    },
    to: {
      nodeId: "node-2",
      portId: "node-2-input-1",
    },
  },
  isDraft: false,
};

describe("Edge", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Edge {...defaultProps} />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("calls graphManager.removeEdgeById with edge.id onClick if isDraft == false", () => {
    const removeEdgeById = jest.fn();
    const graphManager = createGraphManager();

    graphManager.removeEdgeById = removeEdgeById;
    useGraphManager.mockImplementation(mockUseGraphManager(graphManager));
    render(
      <svg>
        <Edge {...defaultProps} />
      </svg>
    );

    fireEvent.click(screen.getByTestId(defaultProps.edge.id));
    expect(removeEdgeById).toHaveBeenCalled();
  });

  it("does not call graphManager.removeEdgeById onClick if isDraft == true", () => {
    const isDraft = true;
    const removeEdgeById = jest.fn();
    const graphManager = createGraphManager();

    graphManager.removeEdgeById = removeEdgeById;
    useGraphManager.mockImplementation(mockUseGraphManager(graphManager));
    render(
      <svg>
        <Edge {...defaultProps} isDraft={isDraft} />
      </svg>
    );

    fireEvent.click(screen.getByTestId(defaultProps.edge.id));
    expect(removeEdgeById).not.toHaveBeenCalled();
  });

  it("sets graphManager.selectedNodeIds to empty array onMouseDown if isDraft == false", () => {
    const selectNodeIdsSetter = jest.fn();
    const graphManager = createGraphManager();

    // override the value property definition with our mocked setter
    Object.defineProperty(graphManager, "selectedNodeIds", {
      set: selectNodeIdsSetter,
      configurable: true,
    });

    useGraphManager.mockImplementation(mockUseGraphManager(graphManager));
    render(
      <svg>
        <Edge {...defaultProps} />
      </svg>
    );

    fireEvent.mouseDown(screen.getByTestId(defaultProps.edge.id));
    expect(selectNodeIdsSetter).toHaveBeenCalledWith([]);
  });

  it("does not set graphManager.selectedNodeIds onMouseDown if isDraft == true", () => {
    const isDraft = true;
    const selectNodeIdsSetter = jest.fn();
    const graphManager = createGraphManager();

    // override the value property definition with our mocked setter
    Object.defineProperty(graphManager, "selectedNodeIds", {
      set: selectNodeIdsSetter,
      configurable: true,
    });

    useGraphManager.mockImplementation(mockUseGraphManager(graphManager));
    render(
      <svg>
        <Edge {...defaultProps} isDraft={isDraft} />
      </svg>
    );

    fireEvent.mouseDown(screen.getByTestId(defaultProps.edge.id));
    expect(selectNodeIdsSetter).not.toHaveBeenCalledWith([]);
  });

  it("add class .IsHovered onMouseDownEnter if isDraft === false", async () => {
    render(
      <svg>
        <Edge {...defaultProps} />
      </svg>
    );

    fireEvent.mouseEnter(screen.getByTestId(defaultProps.edge.id));
    expect(screen.queryByTestId(defaultProps.edge.id)).toHaveClass("isHovered");
  });

  it("does not add class .IsHovered onMouseDownEnter if isDraft === true", () => {
    const isDraft = true;

    render(
      <svg>
        <Edge {...defaultProps} isDraft={isDraft} />
      </svg>
    );

    fireEvent.mouseEnter(screen.getByTestId(defaultProps.edge.id));
    expect(screen.queryByTestId(defaultProps.edge.id)).not.toHaveClass(
      ".IsHovered"
    );
  });

  it("removes class .IsHovered onMouseDownLeave if isDraft === false", async () => {
    render(
      <svg>
        <Edge {...defaultProps} />
      </svg>
    );

    fireEvent.mouseEnter(screen.getByTestId(defaultProps.edge.id));
    fireEvent.mouseLeave(screen.getByTestId(defaultProps.edge.id));
    expect(screen.queryByTestId(defaultProps.edge.id)).not.toHaveClass(
      "isHovered"
    );
  });

  it("does not remove class .IsHovered onMouseDownLeave if isDraft === true", () => {
    const isDraft = true;

    render(
      <svg>
        <Edge {...defaultProps} isDraft={isDraft} />
      </svg>
    );

    fireEvent.mouseEnter(screen.getByTestId(defaultProps.edge.id));
    fireEvent.mouseLeave(screen.getByTestId(defaultProps.edge.id));
    expect(screen.queryByTestId(defaultProps.edge.id)).not.toHaveClass(
      ".IsHovered"
    );
  });
});
