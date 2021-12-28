import { createCallbacks } from "@component/hooks/useCallbacks";
import * as Types from "@component/types";

function mockUseCallbacks(
  callbacks: Types.Callbacks = createCallbacks()
): () => Types.Callbacks {
  return () => callbacks;
}

export { mockUseCallbacks };
