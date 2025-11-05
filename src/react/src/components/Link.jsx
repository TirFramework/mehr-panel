import { Link } from "react-router-dom";

const Btn = (props) => {
  return (
    <>
      <Link to={props.path}>{props.display}</Link>
    </>
  );
};

export default Btn;
