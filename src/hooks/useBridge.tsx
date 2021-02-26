import React, {createContext, useMemo, useContext, ReactNode} from "react";
import * as Types from "@app/types";

const Context = createContext();

interface Props {
  value?: Types.Bridge;
  children?: ReactNode;
}

class Bridge implements Types.Bridge {
  onClickCanvas(event, position, graphManager) {}
  onClickPort(event, port, graphManager) {}
  onKeyPress(event, key, graphManager) {}
}

export function BridgeProvider(props: Props) {
  const {value, children} = props;
  const bridge = useMemo(() => {
    const defaultBridge = new Bridge();
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
