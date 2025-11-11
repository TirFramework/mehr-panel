import React, { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "antd";
import Detail from "./Detail";
import Create from "./Create";
import Index from "./Index";

// Cache برای lazy components - فقط برای جلوگیری از re-creation
const lazyPageCache = {};

// تابع helper برای تعیین fallback component
const getFallbackComponent = (type) => {
  if (type === "create") return Create;
  if (type === "detail") return Detail;
  if (type === "index") return Index;
  return Index;
};

const Custom = ({ type, ...props }) => {
  const { pageModule } = useParams();

  // اگر pageModule وجود ندارد، مستقیماً fallback را render می‌کنیم
  if (!pageModule) {
    const FallbackComponent = getFallbackComponent(type);
    return <FallbackComponent {...props} />;
  }

  // استفاده از env برای چک سریع (اختیاری - اگر env موجود نباشد، باز هم کار می‌کند)
  let dynamicPages = [];
  try {
    if (process.env.VITE_DYNAMIC_PAGES) {
      dynamicPages = JSON.parse(process.env.VITE_DYNAMIC_PAGES);
      // اگر env موجود باشد و pageModule در لیست نباشد، fallback را render می‌کنیم
      if (!dynamicPages.includes(pageModule)) {
        const FallbackComponent = getFallbackComponent(type);
        return <FallbackComponent {...props} />;
      }
    }
  } catch (error) {
    console.error("❌ Error parsing VITE_DYNAMIC_PAGES:", error);
  }

  // اگر lazy component قبلاً ساخته شده، از cache استفاده می‌کنیم
  if (!lazyPageCache[pageModule]) {
    lazyPageCache[pageModule] = lazy(() =>
      import(`../dynamic-pages/${pageModule}.jsx`).catch((error) => {
        console.error(`❌ فایل ${pageModule}.jsx پیدا نشد:`, error);
        // برگرداندن fallback component در صورت خطا
        return {
          default: () => {
            const FallbackComponent = getFallbackComponent(type);
            return (
              <div>
                <div style={{ padding: "20px", color: "red", marginBottom: "20px", backgroundColor: "#ffe6e6", borderRadius: "4px" }}>
                  ⚠️ فایل {pageModule}.jsx پیدا نشد
                </div>
                <FallbackComponent {...props} />
              </div>
            );
          },
        };
      })
    );
  }

  const DynamicPage = lazyPageCache[pageModule];

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
