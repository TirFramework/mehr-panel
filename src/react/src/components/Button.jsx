import React from "react";
import {Button} from "antd";
const Btn = (props) => {

  return (
    <>
        <Button {...props.options} data-cy={props.testId} href={props.path}>{props.display}</Button>

    </>
  );
};

export default Btn;
