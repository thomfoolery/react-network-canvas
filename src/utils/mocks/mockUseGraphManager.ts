import { createGraphManager } from "@component/utils";
import * as Types from "@component/types";

function mockUseGraphManager(
  graphManager: Types.GraphManager = createGraphManager()
): () => Types.GraphManager {
  return () => graphManager;
}

export { mockUseGraphManager };
