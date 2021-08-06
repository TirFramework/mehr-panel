import { lazy, Suspense } from "react";

const Icon = (props) => {
  const I = lazy(() => import(`@ant-design/icons/es/icons/${props.type}.js`));
  return <I />;
};

const DynamicIcon = (props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Icon type={props.type}/>
    </Suspense>
  );
};

export default DynamicIcon;
