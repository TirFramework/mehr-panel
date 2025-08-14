import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "antd";
import Detail from "./Detail";
import Create from "./Create";
import Index from "./Index";
// import { capitalize } from "../lib/helpers"

const Field = (props) => {
  const { pageModule } = useParams();
  const DynamicPage = lazy(() =>
    import(`../dynamic-pages/${pageModule}`).catch((error) => {
      return {
        default: () => {
          if (props.type === "create") {
            return <Create pageType="create" />;
          } else if (props.type === "detail") {
            return <Detail pageType="detail" />;
          } else if (props.type === "index") {
            return <Index pageType="index" />;
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
