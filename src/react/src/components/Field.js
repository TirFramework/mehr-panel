import { lazy, Suspense } from "react";

const DynamicField = (props) => {
  const F = lazy(() => import(`./${props.type}.js`));
  return <F {...props}/>;
};

const Field = (props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicField type={props.type} {...props} />
    </Suspense>
  );
};

export default Field;
