import * as Types from "@component/types";

function roundToGrid(
  position: Types.Position = { x: 0, y: 0 },
  gridSize: number
): Types.Position {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
  };
}

export { roundToGrid };
