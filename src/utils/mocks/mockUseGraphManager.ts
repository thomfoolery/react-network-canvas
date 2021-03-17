import {createGraphManager} from "@component/hooks/useGraphManager";
import * as Types from "@component/types";

function mockUseGraphManager(
  graphManager: Types.GraphManager = createGraphManager()
): () => Types.GraphManager {
  return () => graphManager;
}

export {mockUseGraphManager};
