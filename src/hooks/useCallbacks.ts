import { useContext } from "react";

import { CallbacksContext } from "@component/contexts";
import * as Types from "@component/types";

function useCallbacks(): Types.Callbacks {
  return useContext(CallbacksContext);
}

export { useCallbacks };
