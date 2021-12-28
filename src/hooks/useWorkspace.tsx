import { RefObject } from "react";
import * as Types from "@component/types";

interface Options {
  panZoomRef: RefObject<number>;
  workspaceDivRef: RefObject<HTMLElement>;
  isSelectBoxKeyDownRef: RefObject<boolean>;
  setZoom(): void;
  setPan(): void;
}

let workspaceInstance: Types.Workspace;

function createWorkspace(options: Options): Types.Workspace {
  const {
    panZoomRef,
    workspaceDivRef,
    isSelectBoxKeyDownRef,
    setPan,
    setZoom,
  } = options;

  const offset: Types.Position = {
    get x() {
      return workspaceDivRef.current.getBoundingClientRect().left;
    },
    get y() {
      return workspaceDivRef.current.getBoundingClientRect().top;
    },
  };

  const API = {
    setPan,
    setZoom,
    get container() {
      return workspaceDivRef.current;
    },
    get isSelectBoxKeyDown() {
      return isSelectBoxKeyDownRef.current || false;
    },
    get panZoom() {
      return panZoomRef.current;
    },
    getElementDimensions(element) {
      const { zoom } = this.panZoom;
      const BCR = element.getBoundingClientRect();

      return {
        width: BCR.width / zoom,
        height: BCR.height / zoom,
      };
    },
    getCanvasPosition(object) {
      const { zoom } = this.panZoom;

      if (object instanceof HTMLElement) {
        const BCR = object.getBoundingClientRect();
        return {
          x: (BCR.left - offset.x) / zoom - this.panZoom.x / zoom,
          y: (BCR.top - offset.y) / zoom - this.panZoom.y / zoom,
        };
      }
      if (object instanceof DOMRect) {
        return {
          x: (object.left - offset.x) / zoom - this.panZoom.x / zoom,
          y: (object.top - offset.y) / zoom - this.panZoom.y / zoom,
        };
      } else if ("clientX" in object && "clientY" in object) {
        return {
          x: (object.clientX - offset.x) / zoom - this.panZoom.x / zoom,
          y: (object.clientY - offset.y) / zoom - this.panZoom.y / zoom,
        };
      }

      throw Error("Unsupported object");
    },
  };

  workspaceInstance = API;

  return workspaceInstance;
}

function useWorkspace(): Types.Workspace {
  return workspaceInstance;
}

export { createWorkspace, useWorkspace };
