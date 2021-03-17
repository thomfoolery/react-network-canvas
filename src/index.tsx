import React, {useMemo} from "react";
import * as Types from "@component/types";
import {Root} from "@component/containers";
import {createOptions} from "@component/hooks";

interface Props {
  nodes: Types.Node[];
  edges: Types.Edge[];
  bridge?: Types.Bridge;
  options?: any;
  theme?: any;
}

function NetworkCanvas(props: Props) {
  const {nodes = [], edges = [], bridge, theme = {}, options = {}} = props;
  const mergedOptions = useMemo(() => createOptions(options), [options]);

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

export {NetworkCanvas};
