import React, { createContext, ReactNode } from "react";
import * as Types from "@component/types";

const WorkspaceContext = createContext();

interface Props {
  value?: Types.Workspace;
  children?: ReactNode;
}

function WorkspaceProvider(props: Props): ReactNode {
  const { value, children } = props;

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export { WorkspaceContext, WorkspaceProvider };
