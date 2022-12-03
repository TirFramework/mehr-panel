import { Link } from "react-router-dom";

const Btn = (props) => {

  return (
    <>
        <Link to={props.path}>test</Link>
    </>
  );
};

export default Btn;
