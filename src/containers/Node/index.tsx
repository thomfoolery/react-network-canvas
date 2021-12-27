import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { Port as PortComponent } from "../Port";
import * as Types from "@component/types";

import {
  useGraphManager,
  useDragManager,
  useWorkspace,
  useOptions,
  useBridge,
} from "@component/hooks";
import { isClick, svgGeneratePath } from "@component/utils";

import styles from "./styles.module.css";

interface Props {
  key?: string;
  node: Types.Node;
}

function Node(props: Props): ReactNode {
  const { node } = props;
  const graphManager = useGraphManager();
  const dragManager = useDragManager();
  const workspace = useWorkspace();
  const options = useOptions();
  const bridge = useBridge();

  const { NodeComponent } = options;

  const [isSelected, setIsSelected] = useState(false);
  const [position, setPosition] = useState(node.position);
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });

  const { id, inputPorts, outputPorts } = node;
  const finalPosition = {
    x: position.x + dragDelta.x,
    y: position.y + dragDelta.y,
  };

  const edges = graphManager.getEdgesByNodeId(id);

  const edgesIn = useMemo(() => {
    return edges.filter(({ to }) => to.nodeId === id);
  }, [edges]);

  const edgesOut = useMemo(() => {
    return edges.filter(({ from }) => from.nodeId === id);
  }, [edges]);

  const handleMouseDown = useCallback(() => {
    if (dragManager.dragData?.dragType === "port") {
      return;
    }

    dragManager.dragData = { dragType: "node", node };

    if (
      !workspace.isSelectBoxKeyDown &&
      !graphManager.selectedNodeIds.includes(id)
    ) {
      graphManager.selectedNodeIds = [id];
    }
  }, [node, workspace, dragManager, graphManager]);

  const handleMouseUp = useCallback(
    (event) => {
      const { dragData } = dragManager;
      if (
        dragData?.dragType === "port" &&
        dragData?.port?.parentNode.id !== node.id &&
        node.inputPorts.length === 1
      ) {
        const edge = {
          from: {
            nodeId: dragData.port.parentNode.id,
            portId: dragData.port.id,
          },
          to: {
            nodeId: node.id,
            portId: node.inputPorts[0].id,
          },
        };
        graphManager.createEdge(edge);
      }
      if (isClick(dragManager.dragDelta)) {
        if (workspace.isSelectBoxKeyDown) {
          if (graphManager.selectedNodeIds.includes(id)) {
            graphManager.removeSelectedNodeId(id);
          } else {
            graphManager.appendSelectedNodeId(id);
          }
        }
        bridge.onClickNode(event, node, graphManager);
      }
    },
    [node, bridge, workspace, dragManager, graphManager]
  );

  useEffect(
    () => edgesIn.forEach((edge) => updateEdgePath(edge, workspace)),
    [dragDelta, workspace]
  );
  useEffect(
    () => edgesOut.forEach((edge) => updateEdgePath(edge, workspace)),
    [edgesOut, dragDelta, workspace]
  );

  useEffect(() => {
    graphManager.subscribeToNodePositionChangeById(id, setPosition);
    return () =>
      graphManager.unsubscribeToNodePositionChangeById(id, setPosition);
  }, [id, setPosition]);

  useEffect(() => {
    graphManager.subscribeToIsSelectedById(id, setIsSelected);
    return () => graphManager.unsubscribeToIsSelectedById(id, setIsSelected);
  }, [id, setIsSelected]);

  useEffect(() => {
    graphManager.subscribeToDragDeltaById(id, setDragDelta);
    return () => graphManager.unsubscribeToDragDeltaById(id, setDragDelta);
  }, [id, setDragDelta]);

  const containerClassList = [styles.Node];

  if (isSelected) {
    containerClassList.push(styles.isSelected);
  }

  return (
    <NodeComponent
      node={node}
      position={finalPosition}
      isSelected={isSelected}
      inputPorts={inputPorts}
      outputPorts={outputPorts}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      PortComponent={PortComponent}
    />
  );
}

function updateEdgePath(edge, workspace) {
  if (!workspace) return;

  const svgPath = document.querySelector(`#Edge-${edge.id}`);
  const portFrom = document.querySelector(`#Port-${edge.from.portId}`);
  const portTo = document.querySelector(`#Port-${edge.to.portId}`);

  if (!portFrom) {
    console.log(`Port ${edge.from.portId} does not exist`);
    return;
  }
  if (!portTo) {
    console.log(`Port ${edge.to.portId} does not exist`);
    return;
  }

  const portFromBCR = portFrom.getBoundingClientRect();
  const portFromPosition = workspace.getCanvasPosition(portFromBCR);

  const portToBCR = portTo.getBoundingClientRect();
  const portToPosition = workspace.getCanvasPosition(portToBCR);

  const x1 = portFromPosition.x + portFrom.clientWidth / 2;
  const y1 = portFromPosition.y + portFrom.clientHeight / 2;

  const x2 = portToPosition.x + portTo.clientWidth / 2;
  const y2 = portToPosition.y + portTo.clientHeight / 2;

  const path = svgGeneratePath(x1, y1, x2, y2);

  svgPath?.setAttribute("d", path);
  svgPath?.nextElementSibling?.setAttribute("d", path);
}

export { Node };
