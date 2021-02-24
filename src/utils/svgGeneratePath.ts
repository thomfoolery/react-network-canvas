import {svgPathRoundCorners} from "./svgPathRoundCorners";

const MARGIN = 15;
const RADIUS = 15;
const BEZIER_WEIGHT = 0.5;

function generateCurvedSvgPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string {
  const dx = Math.abs(x2 - x1) * BEZIER_WEIGHT;

  const x3 = x1 + MARGIN;

  const p3x = x2 - MARGIN;
  const p3y = y2;

  const p2x = p3x - dx;
  const p2y = y2;

  const p1x = x3 + dx;
  const p1y = y1;

  return `M${x1} ${y1} L${x3} ${y1} C${p1x} ${p1y} ${p2x} ${p2y} ${p3x} ${p3y} L${x2} ${y2}`;
}

function svgGeneratePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string {
  const xDiff = x2 - x1;
  const yDiff = y2 - y1;

  if (xDiff > MARGIN * 4) {
    return generateCurvedSvgPath(x1, y1, x2, y2);
  }

  if (xDiff > MARGIN * -2) {
    return svgPathRoundCorners(
      [
        // start at source
        `M${x1} ${y1}`,
        // move horizontally from source + MARGIN
        `L${x1 + MARGIN * 2} ${y1}`,

        // move vertically to target
        `L${x2 - MARGIN * 2 + 10} ${y2}`,
        // move horizontal to target, end
        `L${x2} ${y2}`,
      ].join(" "),
      RADIUS,
      false
    );
  }

  const offset = MARGIN * 2 * (yDiff > 0 ? 1 : -4.3);

  return svgPathRoundCorners(
    [
      // start at source
      `M${x1} ${y1}`,
      // move horizontally from source + MARGIN
      `L${x1 + MARGIN * 2} ${y1}`,

      // midline
      `L${x1 + MARGIN * 2} ${y1 + offset}`,
      `L${x2 - MARGIN * 2 + 10} ${y1 + offset}`,

      // move vertically to target
      `L${x2 - MARGIN * 2 + 10} ${y2}`,
      // move horizontal to target, end
      `L${x2} ${y2}`,
    ].join(" "),
    RADIUS,
    false
  );
}

export {svgGeneratePath};
