import { useContext } from "react";

import { WorkspaceContext } from "@component/contexts";
import * as Types from "@component/types";

function useWorkspace(): Types.Workspace {
  return useContext(WorkspaceContext);
}

export { useWorkspace };
