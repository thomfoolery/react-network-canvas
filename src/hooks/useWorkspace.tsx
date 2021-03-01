import React, {createContext, useContext, ReactNode} from "react";
import * as Types from "@app/types";

const Context = createContext();

interface Props {
  value?: Types.Workspace;
  children?: ReactNode;
}

export function WorkspaceProvider(props: Props) {
  const {value, children} = props;

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useWorkspace() {
  return useContext(Context);
}
