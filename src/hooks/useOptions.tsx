import React, {createContext, useContext, ReactNode} from "react";
import {Node as NodeComponent, Port as PortComponent} from "@app/components";

const Context = createContext();

interface Props {
  value?: any;
  children?: ReactNode;
}

export function OptionsProvider(props: Props) {
  const {value, children} = props;
  const options = {
    NodeComponent,
    PortComponent,
    ...value,
  };

  return <Context.Provider value={options}>{children}</Context.Provider>;
}

export function useOptions() {
  return useContext(Context);
}
