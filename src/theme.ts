export function themeToStyles(providedTheme) {
  const theme = mergeDeep(defaultTheme, providedTheme);

  return flattenThemeObject(theme);
}

const defaultTheme = {
  workspace: {
    backgroundSize: "",
    backgroundImage: "",
    backgroundColor: "#f6f6f6",
  },
  canvas: {
    borderRadius: "5px",
    boxShadow: "0 0 0 1px lightgrey",
    backgroundColor: "white",
    backgroundSize: "var(--NC-grid-size) var(--NC-grid-size)",
    backgroundImage:
      "radial-gradient(lightgray, lightgray 1px, transparent 1px)",
    backgroundPosition: "50% 50%",
  },
  edge: {
    stroke: "black",
    strokeWidth: "3px",
    hover: {
      stroke: "red",
    },
    draft: {
      stroke: "black",
    },
  },
};

function flattenThemeObject(theme, prefix = "--NC", styles = {}) {
  Object.keys(theme).forEach((key) => {
    const propKey = `${prefix}-${camelToKebabCase(key)}`;
    const value = theme[key];

    if (isPOJO(value)) {
      flattenThemeObject(value, propKey, styles);
    } else {
      styles[propKey] = value;
    }
  });

  return styles;
}

function mergeDeep(target, source) {
  const isObject = (obj) => obj && typeof obj === "object";

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  Object.keys(source).forEach((key) => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });

  return target;
}

function isPOJO(arg) {
  if (arg == null || typeof arg !== "object") {
    return false;
  }
  const proto = Object.getPrototypeOf(arg);
  if (proto == null) {
    return true; // `Object.create(null)`
  }
  return proto === Object.prototype;
}

function camelToKebabCase(str: string) {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
}
