import React, {createContext, useContext, ReactNode, RefObject} from "react";
import * as Types from "@component/types";

const Context = createContext();

interface Options {
  panZoomRef: RefObject<number>;
  workspaceDivRef: RefObject<HTMLElement>;
  isSelectBoxKeyDownRef: RefObject<boolean>;
  setZoom(): void;
  setPan(): void;
}

function createWorkspace(options: Options): Types.Workspace {
  const {
    panZoomRef,
    workspaceDivRef,
    isSelectBoxKeyDownRef,
    setZoom,
    setPan,
  } = options;

  return {
    setPan,
    setZoom,
    get container() {
      return workspaceDivRef.current;
    },
    get isSelectBoxKeyDown() {
      return isSelectBoxKeyDownRef.current || false;
    },
    mountContextScreenOffset: {
      get x() {
        return workspaceDivRef.current.getBoundingClientRect().left;
      },
      get y() {
        return workspaceDivRef.current.getBoundingClientRect().top;
      },
    },
    get panZoom() {
      return panZoomRef.current;
    },
    getElementDimensions(element) {
      const {zoom} = this.panZoom;
      const BCR = element.getBoundingClientRect();

      return {
        width: BCR.width / zoom,
        height: BCR.height / zoom,
      };
    },
    getCanvasPosition(object) {
      const {zoom} = this.panZoom;

      if (object instanceof HTMLElement) {
        const BCR = object.getBoundingClientRect();
        return {
          x:
            (BCR.left - this.mountContextScreenOffset.x) / zoom -
            this.panZoom.x / zoom,
          y:
            (BCR.top - this.mountContextScreenOffset.y) / zoom -
            this.panZoom.y / zoom,
        };
      }
      if (object instanceof DOMRect) {
        return {
          x:
            (object.left - this.mountContextScreenOffset.x) / zoom -
            this.panZoom.x / zoom,
          y:
            (object.top - this.mountContextScreenOffset.y) / zoom -
            this.panZoom.y / zoom,
        };
      } else if ("clientX" in object && "clientY" in object) {
        return {
          x:
            (object.clientX - this.mountContextScreenOffset.x) / zoom -
            this.panZoom.x / zoom,
          y:
            (object.clientY - this.mountContextScreenOffset.y) / zoom -
            this.panZoom.y / zoom,
        };
      }

      throw Error("Unsupported object");
    },
  };
}

interface Props {
  value?: Types.Workspace;
  children?: ReactNode;
}

function WorkspaceProvider(props: Props): ReactNode {
  const {value, children} = props;

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

function useWorkspace(): Types.Workspace {
  return useContext(Context);
}

export {createWorkspace, useWorkspace, WorkspaceProvider};
