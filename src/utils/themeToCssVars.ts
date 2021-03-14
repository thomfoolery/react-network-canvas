import {DEFAULT_THEME} from "@component/constants";

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

function themeToCssVars(providedTheme) {
  const theme = mergeDeep(DEFAULT_THEME, providedTheme);
  const styles = flattenThemeObject(theme);

  return styles;
}

export {themeToCssVars};
