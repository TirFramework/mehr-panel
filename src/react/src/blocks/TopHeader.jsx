import React, { Suspense, memo } from "react";
import Config from "../constants/config";
import { createLazyCache } from "../lib/resolveOverride";
import DefaultTopHeader from "./DefaultTopHeader";

export { default as DefaultTopHeader } from "./DefaultTopHeader";

const panelSpecificLayouts = import.meta.glob("../dynamic-layouts/*/*.jsx");
const sharedLayouts = import.meta.glob("../dynamic-layouts/*.jsx");
const getLazyLayout = createLazyCache(
  panelSpecificLayouts,
  sharedLayouts,
  "dynamic-layouts"
);

const DynamicTopHeader = getLazyLayout("CustomTopHeader", Config.prefix);

const TopHeader = (props) => {
  if (!DynamicTopHeader) {
    return <DefaultTopHeader {...props} />;
  }

  return (
    <Suspense fallback={<DefaultTopHeader {...props} />}>
      <DynamicTopHeader {...props} />
    </Suspense>
  );
};

export default memo(TopHeader);
