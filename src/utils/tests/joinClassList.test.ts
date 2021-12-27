import { joinClassList } from "..";

it("joins all arguments together into a string separated by spaces", () => {
  const className = joinClassList("a", "b", "c");

  expect(className).toBe("a b c");
});

it("removes any nil elements", () => {
  const className = joinClassList("a", null, "b", undefined, "c");

  expect(className).toBe("a b c");
});

it("return undefined if filtered set of args is empty", () => {
  const className = joinClassList(null, undefined);

  expect(className).toBe(undefined);
});
