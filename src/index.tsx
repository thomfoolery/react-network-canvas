import React, { useMemo, ReactNode } from "react";
import { RecoilRoot } from "recoil";
import * as Types from "@component/types";
import { Root } from "@component/containers";
import { createOptions } from "@component/hooks";
import { OptionsProvider, CallbacksProvider } from "@component/hooks";

interface Props extends Partial<Types.Callbacks> {
  nodes: Types.Node[];
  edges: Types.Edge[];
  options?: Partial<Types.Options>;
  theme?: any;
}

function NetworkCanvas(props: Props): ReactNode {
  const {
    nodes = [],
    edges = [],
    theme = {},
    options: initialOptions = {},
    onMount = () => null,
    onKeyPress = () => null,
    onClickNode = () => null,
    onClickPort = () => null,
    onDropCanvas = () => null,
    onChangeZoom = () => null,
    onMutateGraph = () => null,
    onClickCanvas = () => null,
    onChangeSelectedNodeIds = () => null,
  } = props;

  const options = useMemo(
    () => createOptions(initialOptions),
    [initialOptions]
  );

  const callbacks = useMemo(
    () => ({
      onMount,
      onKeyPress,
      onClickNode,
      onClickPort,
      onDropCanvas,
      onChangeZoom,
      onMutateGraph,
      onClickCanvas,
      onChangeSelectedNodeIds,
    }),
    [
      onMount,
      onKeyPress,
      onClickNode,
      onClickPort,
      onDropCanvas,
      onChangeZoom,
      onMutateGraph,
      onClickCanvas,
      onChangeSelectedNodeIds,
    ]
  );

  return (
    <RecoilRoot>
      <OptionsProvider value={options}>
        <CallbacksProvider value={callbacks}>
          <Root nodes={nodes} edges={edges} theme={theme} />
        </CallbacksProvider>
      </OptionsProvider>
    </RecoilRoot>
  );
}

export { NetworkCanvas, Types };
