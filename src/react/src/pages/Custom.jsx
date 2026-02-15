import React, { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "antd";
import Detail from "./Detail";
import Create from "./Create";
import Index from "./Index";

// لیست صفحاتی که فایل اختصاصی دارند (در بیلد از vite.config / src/dynamic-pages پر می‌شود)
const DYNAMIC_PAGES = (() => {
  try {
    return process.env.VITE_DYNAMIC_PAGES
      ? JSON.parse(process.env.VITE_DYNAMIC_PAGES)
      : [];
  } catch {
    return [];
  }
})();

const BY_TYPE = { create: Create, detail: Detail, index: Index };
const getFallback = (type) => BY_TYPE[type] ?? Index;

const lazyCache = {};
const getLazy = (pageModule) => {
  if (!lazyCache[pageModule]) {
    lazyCache[pageModule] = lazy(() =>
      import(`../dynamic-pages/${pageModule}.jsx`).catch(() => {
        // فایل نبود → همان fallback بر اساس type (از props در رندر مشخص می‌شود)
        return { default: FallbackByType };
      })
    );
  }
  return lazyCache[pageModule];
};

function FallbackByType(props) {
  const C = getFallback(props.type);
  return <C {...props} />;
}

/**
 * اولویت با فایل: اگر برای این pageModule فایل در dynamic-pages باشد آن را لود می‌کند،
 * وگرنه Index/Create/Detail را بر اساس روت (type) نشان می‌دهد.
 */
const Custom = ({ type = "index", ...props }) => {
  const { pageModule } = useParams();

  const hasCustomFile = pageModule && DYNAMIC_PAGES.includes(pageModule);

  if (!hasCustomFile) {
    const Fallback = getFallback(type);
    return <Fallback type={type} {...props} />;
  }

  const Page = getLazy(pageModule);
  return (
    <Suspense
      fallback={
        <div>
          <Skeleton.Input active className="w-full mb-6" />
        </div>
      }
    >
      <Page pageModule={pageModule} type={type} {...props} />
    </Suspense>
  );
};

export default Custom;
