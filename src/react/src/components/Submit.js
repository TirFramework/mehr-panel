import { Button } from "antd";
import { Link, useParams } from "react-router-dom";

const Submit = (props) => {
  const { pageModule } = useParams();
  return (
    <Button type="primary" htmlType="submit" loading={props.loading}>
      {props.pageId ? "Update" : "Save"}
    </Button>
  );
};

export default Submit;
