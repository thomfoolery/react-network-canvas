import React, { useMemo, ReactNode } from "react";
import * as Types from "@component/types";
import { Root } from "@component/containers";
import { createOptions, createCallbacks } from "@component/utils";
import {
  OptionsProvider,
  CallbacksProvider,
  DragManagerProvider,
} from "@component/contexts";

const noop = () => null;

interface Props extends Partial<Types.Callbacks> {
  initialGraph: {
    nodes: Types.Node[];
    edges: Types.Edge[];
  };
  options?: Partial<Types.Options>;
  theme?: any;
}

function NetworkCanvas(props: Props): ReactNode {
  const {
    initialGraph: { nodes = [], edges = [] },
    theme = {},
    options: initialOptions = {},
    onMount = noop,
    onKeyPress = noop,
    onClickNode = noop,
    onClickPort = noop,
    onDropCanvas = noop,
    onChangeZoom = noop,
    onMutateGraph = noop,
    onClickCanvas = noop,
    onChangeSelectedNodeIds = noop,
  } = props;

  const options = useMemo(
    () => createOptions(initialOptions),
    [initialOptions]
  );

  const callbacks = useMemo(() => {
    return createCallbacks({
      onMount,
      onKeyPress,
      onClickNode,
      onClickPort,
      onDropCanvas,
      onChangeZoom,
      onMutateGraph,
      onClickCanvas,
      onChangeSelectedNodeIds,
    });
  }, [
    onMount,
    onKeyPress,
    onClickNode,
    onClickPort,
    onDropCanvas,
    onChangeZoom,
    onMutateGraph,
    onClickCanvas,
    onChangeSelectedNodeIds,
  ]);

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
