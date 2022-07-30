import { useEffect, useState } from "react";
import { Redirect, useParams, useHistory } from "react-router-dom";
import {
  Form,
  Button,
  Breadcrumb,
  notification,
  Typography,
  Card,
  Space,
} from "antd";

import * as api from "../api";

import Field from "../components/Field";

import { mapErrors } from "../lib/helpers";

const { Title } = Typography;

const Create = () => {
  const { pageModule } = useParams();
  const { pageType } = useParams();
  const { pageId } = useParams();

  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState({
    bootLoad: true,
    submitLoad: false,
  });
  const [redirecting, setRedirecting] = useState(false);

  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  const makeField = () => {
    api.getCreateOrEditFields(pageModule, pageId).then((res) => {
      res.map((field) => {
        field.name = field.name.split(".");
      });
      setFields(res);
      setLoading({
        ...loading,
        bootLoad: false,
      });
    });
  };

  useEffect(() => {
    setLoading({
      ...loading,
      bootLoad: true,
    });
    setFields([]);
    async function makePage() {
      await makeField();
    }
    makePage();
  }, [pageModule, pageId]);

  const onFinish = (values) => {
    console.log("Success:", values);

    // setLoading(true);
    // setLoading({
    //   ...loading,
    //   submitLoad: true,
    // });
    if (pageType === "create") {
      api
        .postCreate(pageModule, values)
        .then((res) => {
          // setLoading(false);

          // setLoading({
          //   ...loading,
          //   submitLoad: false,
          // });

          notification["success"]({
            message: res.message,
          });
          setRedirecting(`/admin/${pageModule}/${res.id}/edit`);
        })
        .catch((err) => {
          // setLoading(false);

          // setLoading({
          //   ...loading,
          //   submitLoad: false,
          // });
          notification["error"]({
            message: mapErrors(err.response.data.message),
          });
        });
    } else if (pageType === "edit") {
      api
        .postEdit(pageModule, pageId, values)
        .then((res) => {
          // setLoading(false);

          // setLoading({
          //   ...loading,
          //   submitLoad: false,
          // });

          notification["success"]({
            message: res.message,
          });
        })
        .catch((err) => {
          // setLoading(false);
          // setLoading({
          //   ...loading,
          //   submitLoad: false,
          // });
        });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // console.log("🚀 ~ file: Create.js ~ line 96 ~ Create ~ redirecting", redirecting)

  if (redirecting) {
    return <Redirect to={redirecting} />;
  }

  return (
    <div className={`${pageModule}-${pageType}`}>
      <Breadcrumb>
        <Breadcrumb.Item className="capitalize">{pageModule}</Breadcrumb.Item>
        <Breadcrumb.Item className="capitalize">{pageType}</Breadcrumb.Item>
      </Breadcrumb>
      <Title className="capitalize">
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
            <Field
              key={index}
              type={field.type}
              loading={loading.bootLoad}
              pageType={pageType}
              {...field}
            />
          ))}
        </Card>

        <Space className="justify-end flex mt-2">
          <Button onClick={goBack}>
            {/* <Link to={`/admin/${pageModule}`}>Cancel</Link> */}
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading.submitLoad}>
            Submit
          </Button>
        </Space>
      </Form>
    </div>
  );
};

export default Create;
