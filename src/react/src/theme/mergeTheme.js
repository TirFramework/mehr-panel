/**
 * Shallow-merge Ant Design theme configs.
 * token merges flat; each components.* block merges shallowly too
 * so overrides don't wipe sibling keys (e.g. Button.primaryShadow).
 */
export default function mergeTheme(base, override) {
  if (!override || typeof override !== "object") {
    return base;
  }

  const baseComponents = base?.components || {};
  const overrideComponents = override.components || {};
  const componentKeys = new Set([
    ...Object.keys(baseComponents),
    ...Object.keys(overrideComponents),
  ]);

  const components = {};
  componentKeys.forEach((key) => {
    components[key] = {
      ...(baseComponents[key] || {}),
      ...(overrideComponents[key] || {}),
    };
  });

  return {
    ...base,
    ...override,
    token: {
      ...(base?.token || {}),
      ...(override.token || {}),
    },
    components,
  };
}
