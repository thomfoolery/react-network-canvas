import {roundToGrid} from "..";

it("rounds a position to the closes grid point", () => {
  const gridSize = 10;

  expect(roundToGrid({x: 99, y: 99}, gridSize)).toStrictEqual({x: 100, y: 100});
  expect(roundToGrid({x: 91, y: 91}, gridSize)).toStrictEqual({x: 90, y: 90});
});
