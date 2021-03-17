import * as Types from "@component/types";

const LIMIT = 5;

function isClick(delta: Types.Position): boolean {
  return Math.abs(delta.x) < LIMIT && Math.abs(delta.y) < LIMIT;
}

export {isClick};
