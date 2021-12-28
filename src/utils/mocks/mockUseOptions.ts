import { createOptions } from "@component/utils";
import * as Types from "@component/types";

const defaultOptions = createOptions();

function mockUseOptions(
  options: Partial<Types.Options> = {}
): () => Types.Options {
  return () => ({ ...defaultOptions, ...options });
}

export { mockUseOptions };
