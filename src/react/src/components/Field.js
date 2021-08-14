import { lazy, Suspense } from "react";
import { capitalize } from "../lib/helpers"

const DynamicField = (props) => {
  const F = lazy(() => import(`./${props.type}.js`));
  return <F {...props}/>;
};

const Field = (props) => {
// console.log("🚀 ~ file: Field.js ~ line 9 ~ Field ~ props", props)
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicField type={props.type} {...props} />
    </Suspense>
  );
};

export default Field;
