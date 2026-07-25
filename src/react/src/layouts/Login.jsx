import React from "react";
import {
  Form,
  Input,
  Button,
  Flex,
  notification,
} from "antd";
import {
  LockOutlined,
  UserOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Config from "../constants/config";
import { useLanguage } from "../context/LanguageContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useLogin from "../hooks/useLogin";
import AuthShell from "./AuthShell";
import responseErrorHandler from "../lib/helpers/responseErrorHandler";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { loading, mustVerify, login, resetVerification } = useLogin();

  useDocumentTitle(t.LOGIN_WELCOME);

  const onFinish = async (values) => {
    const result = await login(values);

    if (result.status === "must_verify") {
      notification.warning({
        message: result.message,
        duration: 20,
      });
      return;
    }

    if (result.status === "no_token") {
      notification.error({ message: t.LOGIN_NO_TOKEN });
      return;
    }

    if (result.status === "error") {
      const error = responseErrorHandler(result.error);
      notification.error({
        message: error.message || t.ERROR_GENERIC,
        description: error.description,
        duration: error.duration,
      });
      return;
    }

    if (result.status === "success") {
      notification.success({ message: t.LOGIN_SUCCESS });
      navigate(`/${Config.prefix}/dashboard`);
    }
  };

  return (
    <AuthShell title={t.LOGIN_WELCOME} subtitle={t.LOGIN_SUBTITLE}>
      <Form
        name="basic"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
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

        <Form.Item
          name="password"
          rules={[{ required: true, message: t.VALIDATION_PASSWORD }]}
        >
          <Input.Password
            size="large"
            placeholder={t.PASSWORD}
            prefix={<LockOutlined />}
          />
        </Form.Item>

        {mustVerify && (
          <Form.Item
            name="code"
            rules={[{ required: true, message: t.VALIDATION_CODE }]}
          >
            <Input
              size="large"
              placeholder={t.VERIFICATION_CODE}
              prefix={<KeyOutlined />}
            />
          </Form.Item>
        )}

        <Form.Item>
          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            {t.SIGN_IN}
          </Button>
        </Form.Item>

        {mustVerify && (
          <Form.Item>
            <Button
              onClick={resetVerification}
              className="w-full"
              type="secondary"
            >
              {t.TRY_AGAIN_CODE}
            </Button>
          </Form.Item>
        )}

        <Flex gap="middle" justify="center">
          <Button
            type="link"
            onClick={() => navigate(`/${Config.prefix}/forgot-password`)}
          >
            {t.FORGOT_PASSWORD}
          </Button>
        </Flex>
      </Form>
    </AuthShell>
  );
};

export default Login;
