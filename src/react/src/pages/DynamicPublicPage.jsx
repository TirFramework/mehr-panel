import React, { Suspense } from "react";
import Config from "../constants/config";
import { createLazyCache } from "../lib/resolveOverride";

const panelSpecificPages = import.meta.glob("../dynamic-public-routes/*/*.jsx");
const sharedPages = import.meta.glob("../dynamic-public-routes/*.jsx");
const getLazyPage = createLazyCache(
  panelSpecificPages,
  sharedPages,
  "dynamic-public-routes"
);

const DynamicPublicPage = ({ pageName, DefaultComponent }) => {
  const DynamicPage = getLazyPage(pageName, Config.prefix);

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
