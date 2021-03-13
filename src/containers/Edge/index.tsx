import React, {useState, useCallback} from "react";
import {useGraphManager} from "@component/hooks";
import {joinClassList} from "@component/utils";
import * as Types from "@component/types";

import styles from "./styles.module.css";

interface Props {
  key?: string;
  edge: Types.Edge;
  isDraft?: boolean;
}

function Edge(props: Props) {
  const {edge, isDraft = false} = props;
  const graphManager = useGraphManager();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(() => {
    graphManager.removeEdgeById(edge.id);
  }, [graphManager]);

  const handleMouseDown = useCallback(() => {
    graphManager.selectedNodeIds = [];
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const className = joinClassList(
    isDraft && styles.isDraft,
    !isDraft && isHovered && styles.isHovered
  );

  return (
    <g
      className={className}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <path id={`Edge-${edge.id}`} className={styles.Edge} />
      <path className={styles.EdgeArea} />
    </g>
  );
}

export {Edge};
