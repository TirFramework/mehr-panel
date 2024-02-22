import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "antd";
// import { capitalize } from "../lib/helpers"

const Field = (props) => {
  const { pageModule } = useParams();
  const DynamicPage = lazy(() =>
    import(`../dynamic-pages/${pageModule}`).catch((error) => {
      return { default: () => <div>Error loading the field.</div> };
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
