import React, {createContext, useContext, ReactNode} from "react";
import * as Types from "@component/types";

const Context = createContext();

interface Props {
  value?: Types.Workspace;
  children?: ReactNode;
}

function createWorkspace({
  panZoomRef,
  workspaceDivRef,
  isSelectBoxKeyDownRef,
  setPan,
  setZoom,
}) {
  return {
    setPan,
    setZoom,
    get container() {
      return workspaceDivRef.current;
    },
    get isSelectBoxKeyDown() {
      return isSelectBoxKeyDownRef.current;
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

function WorkspaceProvider(props: Props) {
  const {value, children} = props;

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

function useWorkspace() {
  return useContext(Context);
}

export {createWorkspace, useWorkspace, WorkspaceProvider};
