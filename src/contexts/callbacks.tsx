import React, { createContext, ReactNode } from "react";
import * as Types from "@component/types";

const CallbacksContext = createContext();

interface Props {
  callbacks: Types.Callbacks;
  children?: ReactNode;
}

function CallbacksProvider(props: Props): ReactNode {
  const { callbacks, children } = props;

  return (
    <CallbacksContext.Provider value={callbacks}>
      {children}
    </CallbacksContext.Provider>
  );
}

export { CallbacksContext, CallbacksProvider };
