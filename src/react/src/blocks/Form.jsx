import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { App, Form, Card, Row, Col, Skeleton } from "antd";
import { useQueryClient } from "@tanstack/react-query";

import { onFinish } from "../lib/helpers";
import SubmitGroup from "../components/SubmitGroup";
import FormGroup from "../components/FormGroup";
import Header from "./Header";
import { useMyContext } from "../context/MyContext";
import { useFieldsQuery } from "../Request";

/**
 * Helper function to traverse fields and extract initial values
 * Recursively processes fields and their children to build initial form values
 */
const traverseFields = (fields, initialValues = {}) => {
  fields.forEach((field) => {
    if (field?.name && field?.value !== undefined) {
      initialValues[field.name] = field.value;
    }
    if (field?.children && Array.isArray(field.children)) {
      traverseFields(field.children, initialValues);
    }
  });
  return initialValues;
};

/**
 * CreateForm Component
 * Main form component for creating and editing records
 * @param {string} type - The type of form (create/edit)
 */
const CreateForm = ({ type }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const [urlParams, setUrlParams] = useSearchParams();
  const { pageModule } = useParams();
  const [isTouched, setIsTouched] = useState(false);
  const { updateMyState } = useMyContext();

  // Extract page IDs from URL params
  const pageId = urlParams.get("id");
  const newId = urlParams.get("newId");
  const recordId = pageId || newId || null;

  // Fetch form fields data
  const { data: fieldsData, ...dataQuery } = useFieldsQuery(
    {
      pageModule: pageModule,
      id: recordId,
      type,
    },
    {
      enabled: !!pageModule, // Only fetch if pageModule exists
    }
  );

  // Reset form fields when pageModule or pageId changes
  useEffect(() => {
    form.resetFields();
  }, [pageModule, pageId, form]);

  // Extract and set initial form values from fields data
  useEffect(() => {
    if (fieldsData?.fields) {
      const initialValues = traverseFields(fieldsData.fields);
      form.setFieldsValue(initialValues);
    }
  }, [fieldsData, form]);

  // Handle browser beforeunload warning when form is touched
  useEffect(() => {
    if (isTouched) {
      const handleBeforeUnload = (event) => {
        const e = event || window.event;
        e.preventDefault();
        if (e) {
          e.returnValue = "";
        }
        return "";
      };

      window.onbeforeunload = handleBeforeUnload;

      // Cleanup function
      return () => {
        window.onbeforeunload = null;
      };
    } else {
      window.onbeforeunload = null;
    }
  }, [isTouched]);

  // Memoize page type to avoid recalculation
  const pageType = useMemo(() => (pageId ? "edit" : "create"), [pageId]);

  // Handle form field changes
  const handleFieldsChange = useCallback(() => {
    setIsTouched(true);
  }, []);

  // Handle form submission failure
  const handleFinishFailed = useCallback((errorInfo) => {
    console.log("Form validation failed:", errorInfo);
  }, []);

  // Handle form submission success
  const handleFinish = useCallback(
    (values) => {
      onFinish({
        message: message,
        values: values,
        setSubmitLoad: updateMyState,
        pageModule: pageModule,
        pageId: recordId,
        setUrlParams: setUrlParams,
        queryClient: queryClient,
        afterSubmit: () => {
          if (form.redirect) {
            navigate(form.redirect);
          }
        },
      });
      setIsTouched(false);
    },
    [message, updateMyState, pageModule, recordId, setUrlParams, queryClient, form, navigate]
  );

  // Memoize loading state to prevent unnecessary re-renders
  const isLoading = dataQuery.isLoading && !fieldsData;

  return (
    <>
      {/* Loading skeleton for header */}
      {isLoading ? (
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

      {/* Main form */}
      <Form
        form={form}
        validateMessages={fieldsData?.validationMsg}
        name="basic"
        scrollToFirstError={true}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        onFieldsChange={handleFieldsChange}
        className="form"
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
      >
        {/* Submit buttons row */}
        <Row justify="end" align="middle" className="header-page">
          <Col>
            <SubmitGroup
              buttons={fieldsData?.buttons}
              actions={fieldsData?.configs?.actions}
              form={form}
              pageId={pageId}
              type={type}
            />
          </Col>
        </Row>

        {/* Form fields card */}
        <Card className="create-edit__card" loading={isLoading}>
          <Row gutter={[16, 16]}>
            {fieldsData?.fields?.map((field, index) => (
              <FormGroup
                key={`${field.name}-${field.id}-${index}`}
                index={index}
                pageType={pageType}
                form={form}
                {...field}
                isFetching={dataQuery.isFetching}
              />
            ))}
          </Row>
        </Card>
      </Form>
    </>
  );
};

export default CreateForm;
