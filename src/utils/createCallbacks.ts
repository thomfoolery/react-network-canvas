import { DEFAULT_CALLBACKS } from "@component/constants";
import * as Types from "@component/types";

function createCallbacks(
  value: Partial<Types.Callbacks> = {}
): Types.Callbacks {
  return {
    ...DEFAULT_CALLBACKS,
    ...value,
  };
}

export { createCallbacks };
