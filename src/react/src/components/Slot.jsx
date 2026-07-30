import React, { Suspense } from "react";
import Config from "../constants/config";
import { createEagerCache, createLazyCache } from "../lib/resolveOverride";

const panelSlotsEager = import.meta.glob("../dynamic-slots/*/*.jsx", {
  eager: true,
});
const sharedSlotsEager = import.meta.glob("../dynamic-slots/*.jsx", {
  eager: true,
});
const getEagerSlot = createEagerCache(
  panelSlotsEager,
  sharedSlotsEager,
  "dynamic-slots"
);

const panelSlotsLazy = import.meta.glob("../dynamic-slots/*/*.jsx");
const sharedSlotsLazy = import.meta.glob("../dynamic-slots/*.jsx");
const getLazySlot = createLazyCache(
  panelSlotsLazy,
  sharedSlotsLazy,
  "dynamic-slots"
);

/** Auth chrome must paint with first frame (no flash). */
const EAGER_SLOTS = new Set(["LoginHeader", "LoginExtra"]);

/**
 * Named injection point. Drop a file to fill it:
 *   dynamic-slots/{Name}.jsx
 *   dynamic-slots/{panel}/{Name}.jsx
 *
 * Built-in names: LoginHeader, LoginExtra, IndexToolbar,
 * FormBeforeFields, LayoutBeforeContent, SidebarFooter
 */
function Slot({ name, fallback = null, panel = Config.prefix, ...props }) {
  if (EAGER_SLOTS.has(name)) {
    const Comp = getEagerSlot(name, panel);
    if (!Comp) return fallback;
    return <Comp {...props} />;
  }

  const Comp = getLazySlot(name, panel);
  if (!Comp) return fallback;

  return (
    <Suspense fallback={fallback}>
      <Comp {...props} />
    </Suspense>
  );
}

export default Slot;
