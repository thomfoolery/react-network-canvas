import {themeToCssVars} from "..";

const defaultCSSVars = {
  "--NC-canvas-background-color": "white",
  "--NC-canvas-background-image":
    "radial-gradient(lightgray, lightgray 1px, transparent 1px)",
  "--NC-canvas-background-position": "50% 50%",
  "--NC-canvas-background-size": "var(--NC-grid-size) var(--NC-grid-size)",
  "--NC-canvas-border-radius": "5px",
  "--NC-canvas-box-shadow": "0 0 0 1px lightgrey",
  "--NC-edge-draft-stroke": "black",
  "--NC-edge-hover-stroke": "red",
  "--NC-edge-stroke": "black",
  "--NC-edge-stroke-width": "3px",
  "--NC-workspace-background-color": "#f6f6f6",
  "--NC-workspace-background-image": "",
  "--NC-workspace-background-size": "",
};

it("notifys all subscribed functions", () => {
  const result = themeToCssVars({
    test: {
      foo: "bar",
    },
  });

  expect(result).toStrictEqual({
    ...defaultCSSVars,
    "--NC-test-foo": "bar",
  });
});
