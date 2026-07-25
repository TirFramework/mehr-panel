import React from "react";
import { Form, Input, Button, Flex, notification } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Config from "../constants/config";
import { useLanguage } from "../context/LanguageContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useForgotPassword from "../hooks/useForgotPassword";
import AuthShell from "../layouts/AuthShell";
import responseErrorHandler from "../lib/helpers/responseErrorHandler";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const {
    loading,
    emailPendingReset,
    requestReset,
    resetPassword,
    clearPending,
  } = useForgotPassword();

  useDocumentTitle(
    emailPendingReset ? t.RESET_PASSWORD_TITLE : t.FORGET_PASSWORD_TITLE
  );

  const notifyError = (error) => {
    const parsed = responseErrorHandler(error);
    notification.error({
      message: parsed.message || t.ERROR_GENERIC,
      description: parsed.description,
      duration: parsed.duration,
    });
  };

  const onFinishForgotPassword = async (values) => {
    const result = await requestReset(values);
    if (result.status === "error") {
      notifyError(result.error);
    }
  };

  const onFinishResetPassword = async (values) => {
    const result = await resetPassword(values);
    if (result.status === "success") {
      navigate(`/${Config.prefix}/login`);
      return;
    }
    if (result.status === "error") {
      notifyError(result.error);
    }
  };

  return (
    <AuthShell
      title={
        emailPendingReset ? t.RESET_PASSWORD_TITLE : t.FORGET_PASSWORD_TITLE
      }
      subtitle={false}
      header={
        <div className="illustration-wrapper">
          <img src="" alt={t.LOGIN_ALT_IMAGE} />
        </div>
      }
    >
      {!emailPendingReset ? (
        <Form
          name="basic"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinishForgotPassword}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: t.VALIDATION_EMAIL }]}
          >
            <Input
              size="large"
              placeholder={t.EMAIL}
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item>
            <Button
              block
              size="large"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              {t.SUBMIT}
            </Button>
          </Form.Item>
          <Flex gap="middle" justify="center">
            <Button
              type="link"
              onClick={() => navigate(`/${Config.prefix}/login`)}
            >
              {t.BACK_TO_LOGIN}
            </Button>
          </Flex>
        </Form>
      ) : (
        <Form
          name="basic"
          className="login-form"
          onFinish={onFinishResetPassword}
          autoComplete="off"
        >
          <Form.Item
            name="code"
            rules={[{ required: true, message: t.VALIDATION_CODE }]}
          >
            <Input.OTP
              autoComplete="new-password"
              size="large"
              length={5}
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="password"
            autoComplete="new-password"
            rules={[{ required: true, message: t.VALIDATION_PASSWORD }]}
          >
            <Input.Password
              size="large"
              placeholder={t.PASSWORD}
              prefix={<LockOutlined />}
            />
          </Form.Item>
          <Form.Item
            name="password_confirmation"
            autoComplete="new-password"
            dependencies={["password"]}
            rules={[
              { required: true, message: t.VALIDATION_PASSWORD_CONFIRM },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t.PASSWORDS_DONT_MATCH));
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              placeholder={t.PASSWORD}
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <Form.Item>
            <Button
              block
              size="large"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              {t.SUBMIT}
            </Button>
          </Form.Item>

          <Flex gap="middle" justify="center">
            <Button
              type="link"
              onClick={() => {
                clearPending();
                navigate(`/${Config.prefix}/login`);
              }}
            >
              {t.BACK_TO_LOGIN}
            </Button>
            <Button type="link" onClick={clearPending}>
              {t.CHANGE_EMAIL}
            </Button>
          </Flex>
        </Form>
      )}
    </AuthShell>
  );
};

export default ForgotPassword;
