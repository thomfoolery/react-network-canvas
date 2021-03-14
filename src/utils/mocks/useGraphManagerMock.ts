import {createGraphManager} from "@component/hooks/useGraphManager";

function useGraphManagerMock() {
  return createGraphManager({nodes: [], edges: []});
}

export {useGraphManagerMock};
