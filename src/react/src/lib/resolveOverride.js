import { lazy } from "react";
import Config from "../constants/config";

/**
 * File-drop override resolution.
 *
 * Priority:
 *   1. {folder}/{panel}/{name}.jsx
 *   2. {folder}/{name}.jsx
 *   3. null (caller uses built-in default)
 *
 * Vite needs static glob paths at build time, so pass maps from
 * import.meta.glob for panel-specific and shared folders
 * (e.g. dynamic-pages with one nested segment, then shared .jsx files).
 *
 * @param {Record<string, () => Promise<unknown>>} panelGlobs
 * @param {Record<string, () => Promise<unknown>>} sharedGlobs
 * @param {string} folder  e.g. "dynamic-pages"
 * @param {string} name    e.g. "dashboard" | "Login" | "IndexToolbar"
 * @param {string} [panel]
 * @returns {(() => Promise<unknown>) | null}
 */
export function resolveImportFn(
  panelGlobs,
  sharedGlobs,
  folder,
  name,
  panel = Config.prefix
) {
  const panelKey = `../${folder}/${panel}/${name}.jsx`;
  const sharedKey = `../${folder}/${name}.jsx`;
  return panelGlobs[panelKey] ?? sharedGlobs[sharedKey] ?? null;
}

/**
 * Lazy component cache keyed by panel + folder + name.
 * Returns null when no override file exists.
 */
export function createLazyCache(panelGlobs, sharedGlobs, folder) {
  const cache = {};

  return (name, panel = Config.prefix) => {
    const key = `${panel}__${folder}__${name}`;
    if (key in cache) {
      return cache[key];
    }

    const importFn = resolveImportFn(
      panelGlobs,
      sharedGlobs,
      folder,
      name,
      panel
    );
    cache[key] = importFn ? lazy(importFn) : null;
    return cache[key];
  };
}
