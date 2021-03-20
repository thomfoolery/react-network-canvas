import React, {useContext, createContext, ReactNode} from "react";
import {DEFAULT_OPTIONS} from "@component/constants";
import * as Types from "@component/types";

const Context = createContext();

interface Props {
  value?: Partial<Types.Options>;
  children?: ReactNode;
}

function createOptions(value: Partial<Types.Options> = {}): Types.Options {
  return {
    ...DEFAULT_OPTIONS,
    ...value,
  };
}

function OptionsProvider(props: Props): ReactNode {
  const {value, children} = props;

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

function useOptions(): Types.Options {
  return useContext(Context);
}

export {createOptions, useOptions, OptionsProvider};
