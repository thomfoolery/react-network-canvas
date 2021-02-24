import React, {useMemo, useState, useEffect} from "react";
import * as Types from "@app/types";
import Port from "../Port";

import {useGraphManager} from "../../hooks";
import {svgGeneratePath} from "../../utils";

import styles from "./styles.module.css";

interface Props {
  node: Types.Node;
}

function Node(props: Props) {
  const {node} = props;
  const graphManager = useGraphManager();
  const [position, setPosition] = useState(node.position);
  const [isSelected, setIsSelected] = useState(false);
  const [dragDelta, setDragDelta] = useState({x: 0, y: 0});

  const {id, inputPorts, outputPorts} = node;
  const style = {
    left: position.x + dragDelta.x,
    top: position.y + dragDelta.y,
  };

  const edges = graphManager.getEdgesByNodeId(id);
  const edgesIn = useMemo(() => {
    return edges.filter(({to}) => to.nodeId === id);
  }, [edges]);
  const edgesOut = useMemo(() => {
    return edges.filter(({from}) => from.nodeId === id);
  }, [edges]);

  useEffect(() => edgesIn.forEach(updateEdgePath), [dragDelta]);
  useEffect(() => edgesOut.forEach(updateEdgePath), [edgesOut, dragDelta]);

  useEffect(() => {
    graphManager.subscribeToNodePositionChangeById(id, setPosition);
    () => graphManager.unsubscribeToNodePositionChangeById(id, setPosition);
  }, [id, setPosition]);

  useEffect(() => {
    graphManager.subscribeToIsSelectedById(id, setIsSelected);
    () => graphManager.unsubscribeToIsSelectedById(id, setIsSelected);
  }, [id, setIsSelected]);

  useEffect(() => {
    graphManager.subscribeToDragDeltaById(id, setDragDelta);
    () => graphManager.unsubscribeToDragDeltaById(id, setDragDelta);
  }, [id, setDragDelta]);

  const containerClassList = [styles.Node];

  if (isSelected) {
    containerClassList.push(styles.isSelected);
  }

  return (
    <div
      style={style}
      id={`Node-${id}`}
      className={containerClassList.join(" ")}
      onClick={() => (graphManager.selectedNodeIds = [id])}
    >
      <div className={styles.NodeInputPorts}>
        {inputPorts.map((port) => (
          <Port key={port.id} port={port} />
        ))}
      </div>
      <div className={styles.NodeOutputPorts}>
        {outputPorts.map((port) => (
          <Port key={port.id} port={port} />
        ))}
      </div>
    </div>
  );
}

function updateEdgePath(edge) {
  const svgPath: any = document.querySelector(`#Edge-${edge.id}`);
  const portFrom: any = document.querySelector(`#Port-${edge.from.portId}`);
  const portTo: any = document.querySelector(`#Port-${edge.to.portId}`);

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
}

export default Node;
