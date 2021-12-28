import { useContext } from "react";

import { OptionsContext } from "@component/contexts";
import * as Types from "@component/types";

function useOptions(): Types.Options {
  return useContext(OptionsContext);
}

export { useOptions };
