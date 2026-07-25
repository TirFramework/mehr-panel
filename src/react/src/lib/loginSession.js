import { setApiToken } from "./authToken";
import Config from "../constants/config";

/**
 * Persist api_token and sync localStorage when panel version changes.
 * No UI, no navigation — only session side-effects.
 *
 * @returns {boolean} false if token is invalid
 */
export function persistLoginSession(token) {
  if (!setApiToken(token)) {
    return false;
  }

  const version = window.localStorage.getItem("version");

  if (version !== Config.panelVersion) {
    const savedToken = localStorage.getItem("api_token");
    Object.keys(localStorage).forEach((key) => {
      if (key !== "api_token") {
        localStorage.removeItem(key);
      }
    });
    window.localStorage.setItem("version", Config.panelVersion);
    if (savedToken) {
      localStorage.setItem("api_token", savedToken);
    }
  }

  return true;
}
