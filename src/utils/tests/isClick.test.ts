import { isClick } from "..";

it("returns true if x < 5 && x > -5", () => {
  expect(isClick({ x: -4, y: 0 })).toBe(true);
  expect(isClick({ x: -3, y: 0 })).toBe(true);
  expect(isClick({ x: -2, y: 0 })).toBe(true);
  expect(isClick({ x: -1, y: 0 })).toBe(true);
  expect(isClick({ x: 0, y: 0 })).toBe(true);
  expect(isClick({ x: 1, y: 0 })).toBe(true);
  expect(isClick({ x: 2, y: 0 })).toBe(true);
  expect(isClick({ x: 3, y: 0 })).toBe(true);
  expect(isClick({ x: 4, y: 0 })).toBe(true);
});

it("returns true if y < 5 && y > -5", () => {
  expect(isClick({ x: 0, y: -4 })).toBe(true);
  expect(isClick({ x: 0, y: -3 })).toBe(true);
  expect(isClick({ x: 0, y: -2 })).toBe(true);
  expect(isClick({ x: 0, y: -1 })).toBe(true);
  expect(isClick({ x: 0, y: 0 })).toBe(true);
  expect(isClick({ x: 0, y: 1 })).toBe(true);
  expect(isClick({ x: 0, y: 2 })).toBe(true);
  expect(isClick({ x: 0, y: 3 })).toBe(true);
  expect(isClick({ x: 0, y: 4 })).toBe(true);
});

it("returns false if x > 5 || x < -5", () => {
  expect(isClick({ x: 6, y: 0 })).toBe(false);
  expect(isClick({ x: -6, y: 0 })).toBe(false);
});

it("returns false if y > 5 || y < -5", () => {
  expect(isClick({ x: 0, y: 6 })).toBe(false);
  expect(isClick({ x: 0, y: -6 })).toBe(false);
});
