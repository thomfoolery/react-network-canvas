import React, { useState, useCallback, ReactNode } from "react";
import { useGraphManager } from "@component/hooks";
import { joinClassList } from "@component/utils";
import * as Types from "@component/types";

import styles from "./styles.module.css";

interface Props {
  key?: string;
  edge: Types.Edge;
  isDraft?: boolean;
}

function Edge(props: Props): ReactNode {
  const { edge, isDraft = false } = props;
  const graphManager = useGraphManager();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(() => {
    if (!isDraft) {
      graphManager.removeEdgeById(edge.id);
    }
  }, [isDraft, graphManager]);

  const handleMouseDown = useCallback(() => {
    if (!isDraft) {
      graphManager.selectedNodeIds = [];
    }
  }, [isDraft]);

  const handleMouseEnter = useCallback(() => {
    if (!isDraft) {
      setIsHovered(true);
    }
  }, [isDraft]);

  const handleMouseLeave = useCallback(() => {
    if (!isDraft) {
      setIsHovered(false);
    }
  }, [isDraft]);

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
      data-testid={`${edge.id}`}
    >
      <path id={`Edge-${edge.id}`} className={styles.Edge} />
      <path className={styles.EdgeArea} />
    </g>
  );
}

export { Edge };
