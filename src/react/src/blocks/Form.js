import { useEffect, useState } from "react";
import {
  useSearchParams,
  useLocation,
  useParams,
  useNavigate,
} from "react-router-dom";
import { App, Form, Typography, Card, Row, Col, Skeleton } from "antd";
import { useQueryClient } from "@tanstack/react-query";

import { onFinish } from "../lib/helpers";
import SubmitGroup from "../components/SubmitGroup";
import FormGroup from "../components/FormGroup";
import Header from "./Header";
import { useMyContext } from "../context/MyContext";
import { useFieldsQuery } from "../Request";
import Prompt from "./Prompt";

const CreateForm = ({ type }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [urlParams, setUrlParams] = useSearchParams();
  const pageId = urlParams.get("id");
  let newId = urlParams.get("newId");

  const { pageModule } = useParams();
  const [isTouched, setIsTouched] = useState(false);

  const { myState, updateMyState } = useMyContext();

  const { data: fieldsData, ...dataQuery } = useFieldsQuery({
    pageModule: pageModule,
    id:
      new URLSearchParams(window.location.search).get("id") ||
      new URLSearchParams(window.location.search).get("newId") ||
      null,
    type,
  });

  useEffect(() => {
    form.resetFields();
  }, [pageModule, pageId, form]);

  useEffect(() => {
    if (fieldsData?.fields) {
      const initialValues = {};

      function traverseFields(fields) {
        fields.forEach((field) => {
          if (field?.name && field?.value !== undefined) {
            initialValues[field.name] = field.value;
          }
          if (field?.children && Array.isArray(field.children)) {
            traverseFields(field.children);
          }
        });
      }

      traverseFields(fieldsData.fields);
      form.setFieldsValue(initialValues);
    }
  }, [fieldsData, form]);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const promptMessage =
    "You have unsaved changes, are you sure you want to leave?";

  const location = useLocation();

  useEffect(() => {
    if (isTouched) {
      window.onbeforeunload = (event) => {
        const e = event || window.event;
        e.preventDefault();
        if (e) {
          e.returnValue = "";
        }
        return "";
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
        <Header type={type} pageTitle={fieldsData?.configs?.module_title} />
      )}

      <Form
        form={form}
        validateMessages={fieldsData?.validationMsg}
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
            queryClient: queryClient,
            afterSubmit: () => {
              if (form.redirect) {
                navigate(form.redirect);
              }
            },
          });
          setIsTouched(false);
        }}
        onFinishFailed={onFinishFailed}
      >
        <Row justify="end" align="middle" className="header-page">
          <Col>
            <SubmitGroup
              buttons={fieldsData?.buttons}
              form={form}
              pageId={pageId}
              type={type}
            />
          </Col>
        </Row>
        <Card className="create-edit__card" loading={dataQuery.isLoading}>
          <Row gutter={[16, 16]}>
            {fieldsData?.fields?.map((field, index) => (
              <FormGroup
                key={index}
                index={index}
                pageType={!!pageId ? "edit" : "create"}
                form={form} // پاس دادن instance فرم
                {...field}
                isFetching={dataQuery.isFetching}
              />
            ))}
          </Row>
        </Card>
      </Form>

      {/* <Prompt /> */}
    </>
  );
};

export default CreateForm;
