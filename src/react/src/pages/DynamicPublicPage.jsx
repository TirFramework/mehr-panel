import React from "react";
import Config from "../constants/config";
import { createEagerCache } from "../lib/resolveOverride";

/**
 * Public auth pages (Login / ForgotPassword).
 * Overrides are loaded eagerly so a custom page paints on the first frame
 * (no flash of the built-in default while a lazy chunk loads).
 */
const panelSpecificPages = import.meta.glob("../dynamic-public-routes/*/*.jsx", {
  eager: true,
});
const sharedPages = import.meta.glob("../dynamic-public-routes/*.jsx", {
  eager: true,
});
const getEagerPage = createEagerCache(
  panelSpecificPages,
  sharedPages,
  "dynamic-public-routes"
);

const DynamicPublicPage = ({ pageName, DefaultComponent }) => {
  const Comp = getEagerPage(pageName, Config.prefix) ?? DefaultComponent;
  return <Comp />;
};

export default DynamicPublicPage;
