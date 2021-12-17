import React, { useMemo, ReactNode } from "react";
import * as Types from "@component/types";
import { Root } from "@component/containers";
import { createOptions } from "@component/hooks";
import { RecoilRoot } from "recoil";

interface Props {
  nodes: Types.Node[];
  edges: Types.Edge[];
  bridge?: Types.Bridge;
  options?: Types.Options;
  theme?: any;
}

function NetworkCanvas(props: Props): ReactNode {
  const { nodes = [], edges = [], bridge, theme = {}, options = {} } = props;
  const mergedOptions = useMemo(() => createOptions(options), [options]);

  return (
    <RecoilRoot>
      <Root
        nodes={nodes}
        edges={edges}
        theme={theme}
        bridge={bridge}
        options={mergedOptions}
      />
    </RecoilRoot>
  );
}

export { NetworkCanvas, Types };
