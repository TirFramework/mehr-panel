import { memo, lazy, Suspense } from "react";

function MyComponent(props) {
  const OtherComponent = lazy(() =>
    import(`@ant-design/icons/es/icons/${props.type}`)
  );
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}

export default memo(MyComponent);
