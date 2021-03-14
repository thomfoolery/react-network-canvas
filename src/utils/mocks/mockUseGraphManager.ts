import {createGraphManager} from "@component/hooks/useGraphManager";

function mockUseGraphManager(graphManager = createGraphManager()) {
  return () => graphManager;
}

export {mockUseGraphManager};
