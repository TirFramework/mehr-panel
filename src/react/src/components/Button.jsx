import {Button} from "antd";

const Btn = (props) => {

  return (
    <>
        <Button {...props.options} href={props.path}>{props.display}</Button>

    </>
  );
};

export default Btn;
