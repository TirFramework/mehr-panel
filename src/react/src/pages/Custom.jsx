import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "antd";
import Detail from "./Detail";
import Create from "./Create";
import Index from "./Index";
// import { capitalize } from "../lib/helpers"

const Field = ({ type, ...props }) => {
  const { pageModule } = useParams();
  const DynamicPage = lazy(() =>
    import(`../dynamic-pages/${pageModule}.jsx`).catch((error) => {
      return {
        default: () => {
          if (type === "create") {
            return <Create />;
          } else if (type === "detail") {
            return <Detail />;
          } else if (type === "index") {
            return <Index />;
          }
        },
      };
    })
  );

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

export default Field;
