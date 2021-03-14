import "@testing-library/jest-dom";

class DOMRect {
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  top = 0;
  right = 0;
  bottom = 0;
  left = 0;

  constructor(
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    top = 0,
    right = 0,
    bottom = 0,
    left = 0
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
  }

  toJSON(...args) {
    return JSON.stringify(this, ...args);
  }

  fromRect(other) {
    return new DOMRect();
  }
}

global.DOMRect = DOMRect;
global.HTMLElement.prototype.getBoundingClientRect = () => new DOMRect();
