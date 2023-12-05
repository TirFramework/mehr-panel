import { memo, lazy, Suspense } from "react";
import { QuestionCircleFilled } from "@ant-design/icons";

function MyComponent(props) {
  let OtherComponent;
  if (process.env.NODE_ENV !== "development") {
    OtherComponent = lazy(() =>
      import(`@ant-design/icons/es/icons/${props.type}`)
    );
  }
  return (
    <div>
      {process.env.NODE_ENV !== "development" ? (
        <Suspense fallback={<div>Loading...</div>}>
          <OtherComponent />
        </Suspense>
      ) : (
        <QuestionCircleFilled />
      )}
    </div>
  );
}

export default memo(MyComponent);
