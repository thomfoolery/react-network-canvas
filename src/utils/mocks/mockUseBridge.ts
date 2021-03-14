import {createBridge} from "@component/hooks/useBridge";

function mockUseBridge(bridge = createBridge()) {
  return () => bridge;
}

export {mockUseBridge};
