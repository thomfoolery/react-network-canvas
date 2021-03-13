import React, {
  createContext,
  useContext,
  ReactNode,
  ReactComponent,
} from "react";
import {
  Node as NodeComponent,
  Port as PortComponent,
} from "@component/components";

const Context = createContext();

interface Options {
  startAtCanvasCenter: boolean;
  canvasMargin: number;
  zoomSensitivity: number;
  zoomWheelKey?: "Shift" | "Control" | "Meta" | "Alt";
  maxZoom: number;
  minZoom: number;
  NodeComponent: ReactComponent;
  PortComponent: ReactComponent;
}

const DEFAULT_OPTIONS: Options = {
  startAtCanvasCenter: true,
  canvasMargin: 50,
  zoomSensitivity: 0.001,
  zoomWheelKey: undefined,
  maxZoom: Infinity,
  minZoom: 0,
  NodeComponent,
  PortComponent,
};

interface Props {
  value?: Partial<Options>;
  children?: ReactNode;
}

export function OptionsProvider(props: Props) {
  const {value, children} = props;
  const options: Options = {
    ...DEFAULT_OPTIONS,
    ...value,
  };

  return <Context.Provider value={options}>{children}</Context.Provider>;
}

export function useOptions() {
  return useContext(Context);
}
