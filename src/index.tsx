import React, { useMemo, ReactNode } from "react";
import * as Types from "@component/types";
import { Root } from "@component/containers";
import { createOptions, createCallbacks } from "@component/utils";
import {
  OptionsProvider,
  CallbacksProvider,
  DragManagerProvider,
} from "@component/contexts";

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
    () =>
      createCallbacks({
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
    <OptionsProvider options={options}>
      <CallbacksProvider callbacks={callbacks}>
        <DragManagerProvider>
          <Root nodes={nodes} edges={edges} theme={theme} />
        </DragManagerProvider>
      </CallbacksProvider>
    </OptionsProvider>
  );
}

export { NetworkCanvas, Types };
