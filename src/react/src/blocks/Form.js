import { useEffect, useState } from "react";
import { useSearchParams, useLocation, useParams } from "react-router-dom";
import { Form, Typography, Card, Row, Col } from "antd";

import * as api from "../api";
import { onFinish } from "../lib/helpers";
import SubmitGroup from "../components/SubmitGroup";
import FormGroup from "../components/FormGroup";
import Header from "./Header";
import { useMyContext } from "../context/MyContext";

const CreateForm = (props) => {
  const [form] = Form.useForm();
  const type = props.type;

  const [urlParams, setUrlParams] = useSearchParams();
  const pageId = urlParams.get("id");

  // const editMode = urlParams.editMode;

  const { pageModule } = useParams();
  const { pageType } = useParams();

  const [data, setData] = useState([]);
  const [bootLoad, setBootLoad] = useState(true);
  const [submitLoad, setSubmitLoad] = useState(true);
  const [isTouched, setIsTouched] = useState(false);

  const { myState, updateMyState } = useMyContext();

  useEffect(() => {
    setIsTouched(false);
    setBootLoad(true);
    setData([]);

    if (type === "detail") {
      api.getDetailFields(pageModule, pageId).then((res) => {
        setData(res);
        setBootLoad(false);
        setSubmitLoad(false);
        form.resetFields();
      });
    } else {
      api.getCreateOrEditFields(pageModule, pageId).then((res) => {
        setData(res);
        setBootLoad(false);
        setSubmitLoad(false);
        form.resetFields();
      });
    }
  }, [pageModule, pageId]);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const promptMessage =
    "You have unsaved changes, are you sure you want to leave?";

  const location = useLocation();

  useEffect(() => {
    if (isTouched) {
      // eslint-disable-next-line consistent-return
      window.onbeforeunload = (event) => {
        const e = event || window.event;
        // Cancel the event
        e.preventDefault();
        if (e) {
          e.returnValue = ""; // Legacy method for cross browser support
        }
        return ""; // Legacy method for cross browser support
      };
    } else {
      window.onbeforeunload = () => {};
    }
  }, [isTouched]);

  return (
    <>
      <Header pageTitle={data.configs?.module_title} />
      <usePrompt
        message={(nextLocation) => {
          // navigation prompt should only happen when pathname is about to change
          // not on urlParams change or location.search change
          if (nextLocation.pathname !== location.pathname && isTouched) {
            return promptMessage;
          }
          return true;
        }}
      />
      <Form
        form={form}
        validateMessages={data.validationMsg}
        name="basic"
        scrollToFirstError={true}
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        initialValues={{
          remember: true,
        }}
        onFieldsChange={() => {
          // add your additionaly logic here
          setIsTouched(true);
        }}
        className="form"
        onFinish={(value) => {
          onFinish({
            values: value,
            setSubmitLoad: updateMyState,
            pageModule: pageModule,
            pageId: pageId,
            setUrlParams: setUrlParams,
          });
          setIsTouched(false);
        }}
        onFinishFailed={onFinishFailed}
      >
        <Row justify="end" align="middle" className="header-page">
          <Col>
            <SubmitGroup buttons={data?.buttons} form={form} pageId={pageId} />
          </Col>
        </Row>
        <Card className="main-card" loading={bootLoad}>
          <Row gutter={[16, 16]}>
            {data.fields?.map((field, index) => (
              <FormGroup
                key={index}
                index={index}
                pageType={!!pageId ? "edit" : "create"}
                loading={submitLoad}
                {...field}
              />
            ))}
          </Row>
        </Card>

        <SubmitGroup buttons={data?.buttons} form={form} pageId={pageId} />
      </Form>
    </>
  );
};

export default CreateForm;
