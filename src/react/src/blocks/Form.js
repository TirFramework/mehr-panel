import { useEffect, useState } from "react";
import { useSearchParams, useLocation, useParams } from "react-router-dom";
import { App, Form, Typography, Card, Row, Col, Skeleton } from "antd";

import * as api from "../api";
import { onFinish } from "../lib/helpers";
import SubmitGroup from "../components/SubmitGroup";
import FormGroup from "../components/FormGroup";
import Header from "./Header";
import { useMyContext } from "../context/MyContext";
import { useFieldsQuery } from "../Request";
import Prompt from "./Prompt";

const CreateForm = ({ type }) => {
  const [form] = Form.useForm();

  const [urlParams, setUrlParams] = useSearchParams();
  const pageId = urlParams.get("id");
  let newId = urlParams.get("newId");

  // const editMode = urlParams.editMode;

  const { pageModule } = useParams();
  const [isTouched, setIsTouched] = useState(false);

  const { myState, updateMyState } = useMyContext();

  const { data: data, ...dataQuery } = useFieldsQuery({
    pageModule: pageModule,
    id:
      new URLSearchParams(window.location.search).get("id") ||
      new URLSearchParams(window.location.search).get("newId") ||
      null,
    type,
  });

  useEffect(() => {
    form.resetFields();
  }, [pageModule, pageId]);

  // useEffect(() => {
  //   setIsTouched(false);
  //   setBootLoad(true);
  //   setData([]);

  //   if (type === "detail") {
  //     api.getDetailFields(pageModule, pageId).then((res) => {
  //       setData(res);
  //       setBootLoad(false);
  //       setSubmitLoad(false);
  //       form.resetFields();
  //     });
  //   } else {
  //     // const { data: data, ...dataQuery } = useCreateOrEditFieldsQuery(
  //     //   pageModule,
  //     //   pageId || new URLSearchParams(window.location.search).get("newId")
  //     // );
  //     api
  //       .getCreateOrEditFields(
  //         pageModule,
  //         pageId || new URLSearchParams(window.location.search).get("newId")
  //       )
  //       .then((res) => {
  //         setData(res);
  //         setBootLoad(false);
  //         setSubmitLoad(false);
  //         form.resetFields();
  //       });
  //   }
  // }, [pageModule, pageId]);

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

  const { message, notification, modal } = App.useApp();

  return (
    <>
      {dataQuery.isLoading ? (
        <>
          <div>
            <Skeleton.Input
              active={true}
              size="large"
              style={{ width: "200px", height: "16px", marginBottom: "14px" }}
            />
          </div>
          <div>
            <Skeleton.Input
              active={true}
              size="large"
              style={{
                width: "calc(100vw - 350px)",
                height: "40px",
                marginBottom: "16px",
              }}
            />
          </div>
        </>
      ) : (
        <Header type={type} pageTitle={data?.configs?.module_title} />
      )}

      <Form
        form={form}
        validateMessages={data?.validationMsg}
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
            message: message,
            values: value,
            setSubmitLoad: updateMyState,
            pageModule: pageModule,
            pageId: pageId || newId,
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
        <Card className="create-edit__card" loading={dataQuery.isLoading}>
          <Row gutter={[16, 16]}>
            {data?.fields?.map((field, index) => (
              <FormGroup
                key={index}
                index={index}
                pageType={!!pageId ? "edit" : "create"}
                form={form}
                {...field}
              />
            ))}
          </Row>
        </Card>

        <SubmitGroup buttons={data?.buttons} form={form} pageId={pageId} />
      </Form>

      {/* <Prompt /> */}
    </>
  );
};

export default CreateForm;
