export function svgGeneratePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string {
  return `M${x1} ${y1} L${x2} ${y2}`;
}
