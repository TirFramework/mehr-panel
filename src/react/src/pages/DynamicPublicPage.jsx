import React, { lazy, Suspense } from "react";
import Config from "../constants/config";

const panelSpecificPages = import.meta.glob("../dynamic-public-routes/*/*.jsx");
const sharedPages = import.meta.glob("../dynamic-public-routes/*.jsx");

const resolvedPages = {};

function resolveDynamicPage(pageName) {
  const panel = Config.prefix;
  const cacheKey = `${panel}__${pageName}`;

  if (cacheKey in resolvedPages) {
    return resolvedPages[cacheKey];
  }

  const panelSpecificKey = `../dynamic-public-routes/${panel}/${pageName}.jsx`;
  const sharedKey = `../dynamic-public-routes/${pageName}.jsx`;
  const importFn =
    panelSpecificPages[panelSpecificKey] ?? sharedPages[sharedKey];

  resolvedPages[cacheKey] = importFn ? lazy(importFn) : null;
  return resolvedPages[cacheKey];
}

const DynamicPublicPage = ({ pageName, DefaultComponent }) => {
  const DynamicPage = resolveDynamicPage(pageName);

  if (!DynamicPage) {
    return <DefaultComponent />;
  }

  return (
    <Suspense fallback={<DefaultComponent />}>
      <DynamicPage />
    </Suspense>
  );
};

export default DynamicPublicPage;
