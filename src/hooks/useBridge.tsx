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
  onUpdateGraph() {},
  onClickCanvas() {},
  onClickPort() {},
  onKeyPress() {},
};

export function BridgeProvider(props: Props) {
  const {value, children} = props;
  const bridge = useMemo(() => {
    return {
      ...defaultBridge,
      ...value,
    };
  }, [value]);

  return <Context.Provider value={bridge}>{children}</Context.Provider>;
}

export function useBridge() {
  return useContext(Context);
}
