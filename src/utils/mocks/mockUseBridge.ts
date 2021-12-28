import { createCallbacks } from "@component/hooks/useCallbacks";
import * as Types from "@component/types";

function mockUseCallbacks(
  bridge: Types.Callbacks = createCallbacks()
): () => Types.Callbacks {
  return () => bridge;
}

export { mockUseCallbacks };
