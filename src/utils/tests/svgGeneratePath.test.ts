import { svgGeneratePath } from "..";

it("notifys all subscribed functions", () => {
  const x1 = 100;
  const y1 = 100;
  const x2 = 100;
  const y2 = 100;
  const result = svgGeneratePath(x1, y1, x2, y2);

  expect(result).toBe(`M${x1} ${y1} L${x2} ${y2}`);
});
