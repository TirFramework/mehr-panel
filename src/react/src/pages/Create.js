import { useEffect, useState } from "react";
import { Link, Redirect, useParams, useHistory } from "react-router-dom";
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

import {mapErrors } from '../lib/helpers'

const { Title } = Typography;

const Create = () => {
  const { pageModule } = useParams();
  const { pageType } = useParams();
  const { pageId } = useParams();

  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  const history = useHistory()

  const goBack = () => {
    history.goBack()
  }

  const makeField = () => {
    if (pageType === "create") {
      api.getCreateFields(pageModule).then((res) => {
        //TODO:: make it function
        res.map((field)=>{
          field.name = field.name.split('.');
        })
        setFields(res);
        setLoading(false);
      });
    } else {
      api.getEditFields(pageModule, pageId).then((res) => {
        //TODO:: make it function
        res.map((field)=>{
          field.name = field.name.split('.');
        })
        setFields(res);
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    setFields([])
    async function makePage() {
      await makeField();
    }
    makePage();
  }, [pageModule, pageId]);

  const onFinish = (values) => {
    console.log("Success:", values);
    setLoading(true);
      if (pageType === "create") {
        api
        .postCreate(pageModule, values)
        .then((res) => {
          console.log("🚀 ~ file: Create.js ~ line 59 ~ .then ~ res", res)
          setLoading(false);
          notification["success"]({
            message: res.message,
          });
          setRedirecting(`/admin/${pageModule}/${res.id}/edit`)
        })
        .catch((err) => {
          setLoading(false);
          console.log("🚀 ~ file: Create.js ~ line 88 ~ onFinish ~ err", err.response.data.message)
          
          notification["error"]({
            message: mapErrors(err.response.data.message),
          });
        });
      } else if (pageType === "edit") {
        api
        .postEdit(pageModule, pageId, values)
        .then((res) => {
          console.log("🚀 ~ file: Create.js ~ line 77 ~ .then ~ res", res)
          setLoading(false);
          notification["success"]({
            message: res.message,
          });
        })
        .catch((err) => {
          console.log("🚀 ~ file: Create.js ~ line 88 ~ onFinish ~ err", err)
          setLoading(false);
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
            <Field key={index} type={field.type} loading={loading} pageType={pageType} {...field} />
          ))}
        </Card>

        <Space className="justify-end flex mt-2">
          <Button onClick={goBack}>
            {/* <Link to={`/admin/${pageModule}`}>Cancel</Link> */}
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Space>
      </Form>
    </div>
  );
};

export default Create;
