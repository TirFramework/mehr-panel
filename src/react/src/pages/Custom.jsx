import React, { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "antd";
import Detail from "./Detail";
import Create from "./Create";
import Index from "./Index";

// Static glob maps — Vite analyses these at build time and creates proper code-split chunks.
// Using import.meta.glob instead of dynamic template-literal imports because Vite cannot
// statically resolve paths where BOTH the directory AND the filename are runtime variables,
// which caused all custom-page imports to fail silently and fall through to the generic Index.
const panelSpecificPages = import.meta.glob("../dynamic-pages/*/*.jsx");
const sharedPages = import.meta.glob("../dynamic-pages/*.jsx");

// Cache for lazy components — prevents re-creation on re-renders
const lazyPageCache = {};

// Helper to determine which fallback component to render based on page type
const getFallbackComponent = (type) => {
  if (type === "create") return Create;
  if (type === "detail") return Detail;
  if (type === "index") return Index;
  return Index;
};

const Custom = ({ type, ...props }) => {
  const { panelName, pageModule } = useParams();

  // If pageModule is missing, render the fallback directly
  if (!pageModule) {
    const FallbackComponent = getFallbackComponent(type);
    return <FallbackComponent {...props} />;
  }

  // Include panelName in the cache key so same-named pages in different panels don't collide
  const cacheKey = `${panelName}__${pageModule}`;

  if (!lazyPageCache[cacheKey]) {
    // Look up the import function from the pre-built glob maps.
    // Panel-specific file takes priority; shared file is the fallback.
    const panelSpecificKey = `../dynamic-pages/${panelName}/${pageModule}.jsx`;
    const sharedKey = `../dynamic-pages/${pageModule}.jsx`;

    const importFn =
      panelSpecificPages[panelSpecificKey] ?? sharedPages[sharedKey];

    if (!importFn) {
      // No custom page file exists — silently use the generic fallback
      const FallbackComponent = getFallbackComponent(type);
      return <FallbackComponent {...props} />;
    }

    lazyPageCache[cacheKey] = lazy(importFn);
  }

  const DynamicPage = lazyPageCache[cacheKey];

  return (
    <Suspense
      fallback={
        <div>
          <Skeleton.Input active={true} className="w-full mb-6" />
        </div>
      }
    >
      <DynamicPage {...props} />
    </Suspense>
  );
};

export default Custom;
