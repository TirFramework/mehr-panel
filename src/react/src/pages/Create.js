import { useEffect, useState } from "react";
import { Redirect, useParams, Link } from "react-router-dom";
import {
  Form,
  Button,
  Breadcrumb,
  notification,
  Typography,
  Card,
  Space,
  Row,
  Col,
} from "antd";

import * as api from "../api";

import Field from "../components/Field";

import { mapErrors } from "../lib/helpers";

import { useUrlParams } from "../hooks/useUrlParams";
import SubmitGroup from "../components/SubmitGroup";

const { Title } = Typography;

const Create = () => {
  const [form] = Form.useForm();

  const [urlParams, , setUrlParams] = useUrlParams();
  const pageId = urlParams.id;
  const editMode = urlParams.editMode;

  const { pageModule } = useParams();
  const { pageType } = useParams();
  // const { pageId } = useParams();

  const [fields, setFields] = useState([]);
  const [bootLoad, setBootLoad] = useState(true);
  const [submitLoad, setSubmitLoad] = useState(true);

  // const makeField = () => {};

  useEffect(() => {
    setBootLoad(true);

    setFields([]);
    api.getCreateOrEditFields(pageModule, pageId).then((res) => {
      res.map((field) => {
        field.name = field.name.split(".");
      });
      setFields(res);
      setBootLoad(false);
      setSubmitLoad(false);
    });
  }, [pageModule, pageId]);

  const onFinish = (values) => {
    console.log("Success:", values);

    setSubmitLoad(true);

    api
      .postEditOrCreate(pageModule, pageId, values)
      .then((res) => {
        setSubmitLoad(false);

        if (!pageId) {
          setUrlParams({ id: res.id });
        }
        notification["success"]({
          message: res.message,
        });
      })
      .catch((err) => {
        setSubmitLoad(false);

        let mes = [];
        for (const [key, value] of Object.entries(err.response.data.message)) {
          value.forEach((val) => {
            mes.push(val);
          });
        }

        notification["warning"]({
          message: "Error !",
          description: (
            <ul className="pl-2">
              {mes.map((val) => (
                <li>{val}</li>
              ))}
            </ul>
          ),
        });
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className={`${pageModule}-${pageType}`}>
      <Breadcrumb>
        <Breadcrumb.Item className="capitalize">{pageModule}</Breadcrumb.Item>
        <Breadcrumb.Item className="capitalize">{pageType}</Breadcrumb.Item>
      </Breadcrumb>

      <Row justify="space-between" align="middle">
        <Col>
          <Title className="capitalize">
            {pageType} {pageModule}
          </Title>
        </Col>
        <Col>
          <SubmitGroup form={form} loading={submitLoad} />
        </Col>
      </Row>
      <Form
        form={form}
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
        <Card loading={bootLoad}>
          <Row>
            {fields.map((field, index) => (
              <Col key={index} span={field.col} className={field.className}>
                <Field type={field.type} pageType={pageType} {...field} />
              </Col>
            ))}
          </Row>
        </Card>

        <SubmitGroup form={form} loading={submitLoad} />
      </Form>
    </div>
  );
};

export default Create;
