import {createBridge} from "@component/hooks/useBridge";
import * as Types from "@component/types";

function mockUseBridge(
  bridge: Types.Bridge = createBridge()
): () => Types.Bridge {
  return () => bridge;
}

export {mockUseBridge};
