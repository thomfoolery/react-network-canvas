import React, {createContext, useMemo, useContext, ReactNode} from "react";
import * as Types from "@component/types";

const Context = createContext();

interface Props {
  value?: Types.Bridge;
  children?: ReactNode;
}

const defaultBridge: Types.Bridge = {
  connect() {},
  onChangeZoom() {},
  onMutateGraph() {},
  onClickCanvas() {},
  onClickNode() {},
  onClickPort() {},
  onKeyPress() {},
  onChangeSelectedNodeIds() {},
};

function createBridge(value: Partial<Types.Bridge> = {}): Types.Bridge {
  return {
    ...defaultBridge,
    ...value,
  };
}

function BridgeProvider(props: Props) {
  const {value, children} = props;
  const bridge = useMemo(() => createBridge(value), [value]);

  return <Context.Provider value={bridge}>{children}</Context.Provider>;
}

function useBridge() {
  return useContext(Context);
}

export {createBridge, useBridge, BridgeProvider};
