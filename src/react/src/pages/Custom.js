import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "antd";
// import { capitalize } from "../lib/helpers"

const Field = (props) => {
  const { pageModule } = useParams();
  const DynamicField = lazy(() => import(`../dynamic-pages/${pageModule}`));

  return (
    <Suspense
      fallback={
        <div>
          <Skeleton.Input active={true} className="w-full mb-6" />
        </div>
      }
    >
      <DynamicField {...props} />
    </Suspense>
  );
};

export default Field;
