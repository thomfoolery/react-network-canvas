import React, {createContext, useMemo, useContext, ReactNode} from "react";
import * as Types from "@component/types";

const Context = createContext();

interface Props {
  value?: Types.Bridge;
  children?: ReactNode;
}

const defaultBridge: Types.Bridge = {
  connect() {
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

function createBridge(value: Partial<Types.Bridge> = {}): Types.Bridge {
  return {
    ...defaultBridge,
    ...value,
  };
}

function BridgeProvider(props: Props): ReactNode {
  const {value, children} = props;
  const bridge = useMemo(() => createBridge(value), [value]);

  return <Context.Provider value={bridge}>{children}</Context.Provider>;
}

function useBridge(): Types.Bridge {
  return useContext(Context);
}

export {createBridge, useBridge, BridgeProvider};
