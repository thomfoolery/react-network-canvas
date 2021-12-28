import React, { createContext, ReactNode } from "react";
import * as Types from "@component/types";

const OptionsContext = createContext();

interface Props {
  options: Types.Options;
  children?: React.ReactNode;
}

function OptionsProvider(props: Props): ReactNode {
  const { options, children } = props;

  return (
    <OptionsContext.Provider value={options}>
      {children}
    </OptionsContext.Provider>
  );
}

export { OptionsContext, OptionsProvider };
