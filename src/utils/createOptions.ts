import { DEFAULT_OPTIONS } from "@component/constants";
import * as Types from "@component/types";

function createOptions(value: Partial<Types.Options> = {}): Types.Options {
  return {
    ...DEFAULT_OPTIONS,
    ...value,
  };
}

export { createOptions };
