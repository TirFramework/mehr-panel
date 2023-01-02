import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Breadcrumb, Typography, Card, Row, Col } from "antd";

import * as api from "../api";
import { onFinish } from "../lib/helpers";
import { useUrlParams } from "../hooks/useUrlParams";
import SubmitGroup from "../components/SubmitGroup";
import FormGroup from "../components/FormGroup";

const Create = () => {
  const [form] = Form.useForm();

  const [urlParams, , setUrlParams] = useUrlParams();
  const pageId = urlParams.id;
  // const editMode = urlParams.editMode;

  const { pageModule } = useParams();
  const { pageType } = useParams();

  const [data, setData] = useState([]);
  const [bootLoad, setBootLoad] = useState(true);
  const [submitLoad, setSubmitLoad] = useState(true);

  useEffect(() => {
    setBootLoad(true);
    setData([]);
    api.getCreateOrEditFields(pageModule, pageId).then((res) => {
      setData(res);
      setBootLoad(false);
      setSubmitLoad(false);
    });
  }, [pageModule, pageId]);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

    let required;
    return (
    <div
      className={`page page-${pageModule} ${pageModule}-${pageId} ${
        pageId ? "edit" : "create"
      }`}
    >
      <Breadcrumb>
        <Breadcrumb.Item className="capitalize">{pageModule}</Breadcrumb.Item>
        <Breadcrumb.Item className="capitalize">{pageType}</Breadcrumb.Item>
      </Breadcrumb>

      <Form
        form={form}
        validateMessages={ data.validationMsg }
        name="basic"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        initialValues={{
          remember: true,
        }}
        className="form"
        onFinish={(value) => {
          onFinish({
            values: value,
            setSubmitLoad: setSubmitLoad,
            pageModule: pageModule,
            pageId: pageId,
            setUrlParams: setUrlParams,
          });
        }}
        onFinishFailed={onFinishFailed}
      >
        <Row justify="space-between" align="middle" className="header-page">
          <Col>
            <Typography.Title className="capitalize">
              {pageModule}
            </Typography.Title>
          </Col>
          <Col>
            <SubmitGroup
              buttons={data?.buttons}
              form={form}
              loading={submitLoad}
              pageId={pageId}
            />
          </Col>
        </Row>
        <Card className="main-card" loading={bootLoad}>
          <Row gutter={[16, 16]}>
            {data.fields?.map((field, index) => (
              <FormGroup
                key={index}
                index={index}
                pageType={pageType}
                loading={submitLoad}
                {...field}
              />
            ))}
          </Row>
        </Card>

        <SubmitGroup
          buttons={data?.buttons}
          form={form}
          loading={submitLoad}
          pageId={pageId}
        />
      </Form>
    </div>
  );
};

export default Create;
