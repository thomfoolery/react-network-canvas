import { useContext } from "react";

import { GraphManagerContext } from "@component/contexts";
import * as Types from "@component/types";

function useGraphManager(): Types.GraphManager {
  return useContext(GraphManagerContext);
}

export { useGraphManager };
