import React, { createContext, ReactNode } from "react";
import * as Types from "@component/types";

const WorkspaceContext = createContext();

interface Props {
  workspace?: Types.Workspace;
  children?: ReactNode;
}

function WorkspaceProvider(props: Props): ReactNode {
  const { workspace, children } = props;

  return (
    <WorkspaceContext.Provider value={workspace}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export { WorkspaceContext, WorkspaceProvider };
