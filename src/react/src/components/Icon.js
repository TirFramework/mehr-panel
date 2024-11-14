import { memo, lazy, Suspense } from "react";
import { QuestionCircleFilled, LoadingOutlined } from "@ant-design/icons";

function MyComponent(props) {
  let OtherComponent;
  if (process.env.NODE_ENV !== "development") {
    OtherComponent = lazy(() =>
      import(`@ant-design/icons/es/icons/${props.type}`).catch((error) =>
        import("@ant-design/icons/es/icons/QuestionCircleFilled")
      )
    );
  }
  return (
    <div>
      {process.env.NODE_ENV !== "development" ? (
        <Suspense fallback={<LoadingOutlined />}>
          <OtherComponent />
        </Suspense>
      ) : (
        <QuestionCircleFilled />
      )}
    </div>
  );
}

export default memo(MyComponent);
