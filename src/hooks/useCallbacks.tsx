import React, { createContext, useMemo, useContext, ReactNode } from "react";
import * as Types from "@component/types";

const Context = createContext();

interface Props {
  value?: Types.Callbacks;
  children?: ReactNode;
}

const defaultCallbacks: Types.Callbacks = {
  onMount() {
    return undefined;
  },
  onChangeZoom() {
    return undefined;
  },
  onMutateGraph() {
    return undefined;
  },
  onClickCanvas() {
    return undefined;
  },
  onClickNode() {
    return undefined;
  },
  onClickPort() {
    return undefined;
  },
  onDropCanvas() {
    return undefined;
  },
  onKeyPress() {
    return undefined;
  },
  onChangeSelectedNodeIds() {
    return undefined;
  },
};

function createCallbacks(
  value: Partial<Types.Callbacks> = {}
): Types.Callbacks {
  return {
    ...defaultCallbacks,
    ...value,
  };
}

function CallbacksProvider(props: Props): ReactNode {
  const { value, children } = props;
  const bridge = useMemo(() => createCallbacks(value), [value]);

  return <Context.Provider value={bridge}>{children}</Context.Provider>;
}

function useCallbacks(): Types.Callbacks {
  return useContext(Context);
}

export { createCallbacks, useCallbacks, CallbacksProvider };
