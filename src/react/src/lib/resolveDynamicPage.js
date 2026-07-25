import { lazy } from "react";
import Config from "../constants/config";

/**
 * All dynamic-pages overrides (flat + folder + panel-scoped).
 * Keys look like:
 *   ../dynamic-pages/client.jsx
 *   ../dynamic-pages/client/index.jsx
 *   ../dynamic-pages/admin/client.jsx
 *   ../dynamic-pages/admin/client/detail.jsx
 */
const dynamicPageModules = import.meta.glob([
  "../dynamic-pages/*.jsx",
  "../dynamic-pages/*/*.jsx",
  "../dynamic-pages/*/*/*.jsx",
]);

const VIEW_BY_TYPE = {
  index: "index",
  detail: "detail",
  create: "create-edit",
  list: "list",
};

/**
 * Resolve a module page override.
 *
 * Priority (panel = URL panelName):
 *   1. {panel}/{module}/{view}.jsx   e.g. admin/client/list.jsx
 *   2. {panel}/{module}.jsx          e.g. admin/client.jsx  (all views)
 *   3. {module}/{view}.jsx           e.g. client/list.jsx
 *   4. {module}.jsx                  e.g. client.jsx        (all views)
 *
 * view: index | detail | create-edit | list
 *
 * @returns {React.LazyExoticComponent | null}
 */
export function resolveDynamicPage(pageModule, type, panel = Config.prefix) {
  const view = VIEW_BY_TYPE[type] || "index";

  const candidates = [
    `../dynamic-pages/${panel}/${pageModule}/${view}.jsx`,
    `../dynamic-pages/${panel}/${pageModule}.jsx`,
    `../dynamic-pages/${pageModule}/${view}.jsx`,
    `../dynamic-pages/${pageModule}.jsx`,
  ];

  for (const key of candidates) {
    const importFn = dynamicPageModules[key];
    if (importFn) {
      return lazy(importFn);
    }
  }

  return null;
}

const lazyPageCache = {};

/**
 * Cached lazy resolver for Custom.jsx.
 */
export function getLazyDynamicPage(pageModule, type, panel = Config.prefix) {
  const view = VIEW_BY_TYPE[type] || "index";
  const cacheKey = `${panel}__${pageModule}__${view}`;

  if (!(cacheKey in lazyPageCache)) {
    lazyPageCache[cacheKey] = resolveDynamicPage(pageModule, type, panel);
  }

  return lazyPageCache[cacheKey];
}
