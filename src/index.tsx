import React from "react";
import * as Types from "@component/types";
import {Root} from "@component/containers";
import {DEFAULT_OPTIONS} from "@component/constants";

interface Props {
  nodes: any[];
  edges: any[];
  theme?: any;
  options?: any;
  bridge?: Types.Bridge;
}

function NodeCanvas(props: Props) {
  const {nodes, edges, bridge, theme = {}, options = {}} = props;
  const mergedOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  return (
    <Root
      nodes={nodes}
      edges={edges}
      theme={theme}
      bridge={bridge}
      options={mergedOptions}
    />
  );
}

export {NodeCanvas};
