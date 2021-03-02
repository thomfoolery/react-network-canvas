import React, {useMemo, useState, useCallback, useEffect} from "react";
import {Port as PortComponent} from "../Port";
import * as Types from "@component/types";

import {
  useOptions,
  useWorkspace,
  useDragManager,
  useGraphManager,
} from "@component/hooks";
import {isClick, svgGeneratePath} from "@component/utils";

import styles from "./styles.module.css";

interface Props {
  key: string;
  node: Types.Node;
}

function Node(props: Props) {
  const {node} = props;
  const options = useOptions();
  const workspace = useWorkspace();
  const dragManager = useDragManager();
  const graphManager = useGraphManager();

  const {NodeComponent} = options;

  const [isSelected, setIsSelected] = useState(false);
  const [position, setPosition] = useState(node.position);
  const [dragDelta, setDragDelta] = useState({x: 0, y: 0});

  const {id, inputPorts, outputPorts} = node;
  const finalPosition = {
    x: position.x + dragDelta.x,
    y: position.y + dragDelta.y,
  };

  const edges = graphManager.getEdgesByNodeId(id);

  const edgesIn = useMemo(() => {
    return edges.filter(({to}) => to.nodeId === id);
  }, [edges]);

  const edgesOut = useMemo(() => {
    return edges.filter(({from}) => from.nodeId === id);
  }, [edges]);

  const handleMouseDown = useCallback(() => {
    dragManager.dragData = {dragType: "node", node};
    if (
      !workspace.isShiftKeyDown &&
      !graphManager.selectedNodeIds.includes(id)
    ) {
      graphManager.selectedNodeIds = [id];
    }
  }, [node, workspace, dragManager, graphManager]);

  const handleMouseUp = useCallback(() => {
    if (isClick(dragManager.dragDelta)) {
      if (workspace.isShiftKeyDown) {
        if (graphManager.selectedNodeIds.includes(id)) {
          graphManager.removeSelectedNodeId(id);
        } else {
          graphManager.appendSelectedNodeId(id);
        }
      }
    }
  }, [workspace, dragManager, graphManager]);

  useEffect(() => edgesIn.forEach(updateEdgePath), [dragDelta]);
  useEffect(() => edgesOut.forEach(updateEdgePath), [edgesOut, dragDelta]);

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

function updateEdgePath(edge) {
  const svgPath: any = document.querySelector(`#Edge-${edge.id}`);
  const portFrom: any = document.querySelector(`#Port-${edge.from.portId}`);
  const portTo: any = document.querySelector(`#Port-${edge.to.portId}`);

  if (!portFrom) {
    console.log(`Port ${edge.from.portId} does not exist`);
    return;
  }
  if (!portTo) {
    console.log(`Port ${edge.to.portId} does not exist`);
    return;
  }

  const x1 =
    portFrom.offsetParent.offsetLeft +
    portFrom.offsetLeft +
    portFrom.clientWidth / 2;

  const y1 =
    portFrom.offsetParent.offsetTop +
    portFrom.offsetTop +
    portFrom.clientHeight / 2;

  const x2 =
    portTo.offsetParent.offsetLeft + portTo.offsetLeft + portTo.clientWidth / 2;

  const y2 =
    portTo.offsetParent.offsetTop + portTo.offsetTop + portTo.clientHeight / 2;

  const path = svgGeneratePath(x1, y1, x2, y2);

  svgPath.setAttribute("d", path);
  svgPath?.nextElementSibling?.setAttribute("d", path);
}

export {Node};
