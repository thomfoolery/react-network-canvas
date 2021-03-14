import {createGraphManager} from "@component/hooks/useGraphManager";
import {createOptions} from "@component/hooks/useOptions";

function mockGraphManager(options = {options: createOptions()}) {
  return createGraphManager(options);
}

export {mockGraphManager};
