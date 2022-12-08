import { Button } from "antd";
import { Link, useParams } from "react-router-dom";

const Cancel = (props) => {
  console.log("🚀 ~ file: Cancel.js:5 ~ Cancel ~ props", props);
  const { pageModule } = useParams();
  return (
    <Button>
      <Link to={props.path || `/admin/${pageModule}`}>
        {props.display || "Cancel"}
      </Link>
    </Button>
  );
};

export default Cancel;
