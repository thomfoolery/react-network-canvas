import React, { createContext } from "react";

import * as Types from "@component/types";

const GraphManagerContext = createContext();

interface Props {
  graphManager: Types.GraphManager;
  children?: React.ReactNode;
}

function GraphManagerProvider(props: Props): React.ReactNode {
  const { graphManager, children } = props;

  return (
    <GraphManagerContext.Provider value={graphManager}>
      {children}
    </GraphManagerContext.Provider>
  );
}

export { GraphManagerContext, GraphManagerProvider };
