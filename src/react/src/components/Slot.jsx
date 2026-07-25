import React, { Suspense } from "react";
import Config from "../constants/config";
import { createLazyCache } from "../lib/resolveOverride";

const panelSlots = import.meta.glob("../dynamic-slots/*/*.jsx");
const sharedSlots = import.meta.glob("../dynamic-slots/*.jsx");
const getLazySlot = createLazyCache(panelSlots, sharedSlots, "dynamic-slots");

/**
 * Named injection point. Drop a file to fill it:
 *   dynamic-slots/{Name}.jsx
 *   dynamic-slots/{panel}/{Name}.jsx
 *
 * Built-in names: LoginHeader, LoginExtra, IndexToolbar,
 * FormBeforeFields, LayoutBeforeContent, SidebarFooter
 */
function Slot({ name, fallback = null, panel = Config.prefix, ...props }) {
  const Comp = getLazySlot(name, panel);

  if (!Comp) {
    return fallback;
  }

  return (
    <Suspense fallback={fallback}>
      <Comp {...props} />
    </Suspense>
  );
}

export default Slot;
