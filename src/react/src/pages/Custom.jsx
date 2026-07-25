import React, { Suspense } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "antd";
import Detail from "./Detail";
import Create from "./Create";
import Index from "./Index";
import List from "./List";
import { getLazyDynamicPage } from "../lib/resolveDynamicPage";

const getFallbackComponent = (type) => {
  if (type === "create") return Create;
  if (type === "detail") return Detail;
  if (type === "list") return List;
  if (type === "index") return Index;
  return Index;
};

const Custom = ({ type, ...props }) => {
  const { panelName, pageModule } = useParams();

  if (!pageModule) {
    const FallbackComponent = getFallbackComponent(type);
    return <FallbackComponent {...props} />;
  }

  const DynamicPage = getLazyDynamicPage(pageModule, type, panelName);

  if (!DynamicPage) {
    const FallbackComponent = getFallbackComponent(type);
    return <FallbackComponent {...props} />;
  }

  return (
    <Suspense
      fallback={
        <div>
          <Skeleton.Input active={true} className="w-full mb-6" />
        </div>
      }
    >
      <DynamicPage type={type} {...props} />
    </Suspense>
  );
};

export default Custom;
