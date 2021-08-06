import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Form,
  Spin,
  Button,
  Breadcrumb,
  notification,
  Typography,
  Card,
  Row,
  Space,
} from "antd";

import * as api from "../api";

import Field from "../components/Field";

const { Title } = Typography;

const Create = () => {
  const { pageModule } = useParams();
  const { pageType } = useParams();
  const { pageId } = useParams();

  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  const makeField = () => {
    if (pageType === "create") {
      api.getCreateFields(pageModule).then((res) => {
        setFields(res);
        setLoading(false);
      });
    } else {
      api.getEditFields(pageModule, pageId).then((res) => {
        setFields(res);
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    async function makePage() {
      await makeField();
    }
    makePage();
  }, []);

  const onFinish = (values) => {
    console.log("Success:", values);

    setLoading(true);
      if (pageType === "create") {
        api
        .postCreate(pageModule, values)
        .then((res) => {
          setLoading(false);
          notification["success"]({
            message: res.data.message,
          });
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
      } else {
        api
        .postEdit(pageModule, pageId, values)
        .then((res) => {
          setLoading(false);
          notification["success"]({
            message: res.data.message,
          });
        })
        .catch((err) => {
          setLoading(false);
          notification["error"]({
            message: err.data.message,
          });
          console.log(err);
        });
      }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item className="capitalize">{pageModule}</Breadcrumb.Item>
        <Breadcrumb.Item>Create</Breadcrumb.Item>
      </Breadcrumb>
      <Title>
        {pageType} {pageModule}
      </Title>
      <Form
        name="basic"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 18,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Card>
          {fields.map((field, index) => (
            <Field key={index} type={field.type} loading={loading} {...field} />
          ))}
        </Card>

        <Space className="justify-end flex mt-2">
          <Button>
            <Link to={`/admin/${pageModule}`}>Cancel</Link>
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Space>
      </Form>
    </>
  );
};

export default Create;
