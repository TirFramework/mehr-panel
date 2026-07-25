import React, { Suspense } from "react";
import { Skeleton } from "antd";
import Config from "../constants/config";
import { createLazyCache } from "../lib/resolveOverride";
import IndexTableBody from "./IndexTableBody";

const panelSlots = import.meta.glob("../dynamic-slots/*/*.jsx");
const sharedSlots = import.meta.glob("../dynamic-slots/*.jsx");
const getLazySlot = createLazyCache(panelSlots, sharedSlots, "dynamic-slots");

/**
 * Resolves IndexBody override, else default table.
 *
 * Drop: dynamic-slots/IndexBody.jsx
 *   or: dynamic-slots/{panel}/IndexBody.jsx
 *
 * Override receives `{ index }` from useIndexPage().
 */
function IndexBody({ index }) {
  const Comp = getLazySlot("IndexBody", Config.prefix);

  if (!Comp) {
    return <IndexTableBody index={index} />;
  }

  return (
    <Suspense
      fallback={
        <div className="table-loading">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      }
    >
      <Comp index={index} />
    </Suspense>
  );
}

export default IndexBody;
