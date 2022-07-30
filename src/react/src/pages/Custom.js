import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "antd";
// import { capitalize } from "../lib/helpers"

const DynamicField = (props) => {
  const F = lazy(() => import(`./dynamic/${props.type}.js`));
  return <F {...props} />;
};

const Field = (props) => {
  const { pageModule } = useParams();
  return (
    <Suspense
      fallback={
        <div>
          <Skeleton.Input active={true} className="w-full mb-6" />
        </div>
      }
    >
      <DynamicField type={pageModule} {...props} />
    </Suspense>
  );
};

export default Field;
