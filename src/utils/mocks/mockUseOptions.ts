import {createOptions} from "@component/hooks/useOptions";

const defaultOptions = createOptions();

function mockUseOptions(options = {}) {
  return () => ({...defaultOptions, ...options});
}

export {mockUseOptions};
