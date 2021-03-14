import React, {
  useMemo,
  useContext,
  createContext,
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
  selectBoxKey?: "Shift" | "Control" | "Alt" | "Meta";
  zoomWheelKey?: "Shift" | "Control" | "Alt" | "Meta";
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
  selectBoxKey: "Shift",
  maxZoom: Infinity,
  minZoom: 0,
  NodeComponent,
  PortComponent,
};

interface Props {
  value?: Partial<Options>;
  children?: ReactNode;
}

function createOptions(value: Partial<Options> = {}) {
  return {
    ...DEFAULT_OPTIONS,
    ...value,
  };
}

function OptionsProvider(props: Props) {
  const {value, children} = props;
  const options: Options = useMemo(() => createOptions(value), [value]);

  return <Context.Provider value={options}>{children}</Context.Provider>;
}

function useOptions() {
  return useContext(Context);
}

export {createOptions, useOptions, OptionsProvider};
