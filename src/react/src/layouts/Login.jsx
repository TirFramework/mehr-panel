import React, { useState } from "react";
import axios from "../lib/axios";
import { setApiToken } from "../lib/authToken";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  notification,
  Card,
  Typography,
  Layout,
  Flex,
} from "antd";

import {
  LockOutlined,
  UserOutlined,
  GithubOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import * as api from "../api";
import Config from "../constants/config";
import { useLanguage } from "../context/LanguageContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  useDocumentTitle(t.LOGIN_WELCOME);
  const [mustVerify, setMustVerify] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTryAgain = () => {
    // Reset mustVerify to false when "Try Again" is clicked
    setMustVerify(false);
  };

  const onFinish = (values) => {
    setLoading(true);
    api
      .postLogin(values)
      .then((res) => {
        setLoading(false);

        if (res.must_verify === true) {
          setMustVerify(true);
          notification["warning"]({
            message: res.message.error,
            duration: 20,
          });
        } else if (!res?.api_token) {
          notification.error({
            message: t.LOGIN_NO_TOKEN,
          });
        } else {
          notification["success"]({
            message: t.LOGIN_SUCCESS,
          });
          login(res.api_token);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const login = (token) => {
    if (!setApiToken(token)) {
      notification.error({
        message: t.LOGIN_NO_TOKEN,
      });
      return;
    }

    const version = window.localStorage.getItem("version");

    if (version !== Config.panelVersion) {
      const savedToken = localStorage.getItem("api_token");
      localStorage.clear();
      window.localStorage.setItem("version", Config.panelVersion);
      if (savedToken) {
        localStorage.setItem("api_token", savedToken);
      }
    }

    navigate(`/${Config.perfix}/dashboard`);
  };

  return (
    <Layout>
      <Layout.Content className="login-page">
        <Card>

          <Form
            name="basic"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Typography.Title className="page-index__title">
              {t.LOGIN_WELCOME}
            </Typography.Title>

            <Typography.Paragraph>{t.LOGIN_SUBTITLE}</Typography.Paragraph>

            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: t.VALIDATION_EMAIL,
                },
              ]}
            >
              <Input
                size="large"
                placeholder={t.EMAIL}
                prefix={<UserOutlined />}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: t.VALIDATION_PASSWORD,
                },
              ]}
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
                rules={[
                  {
                    required: true,
                    message: t.VALIDATION_CODE,
                  },
                ]}
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
                  onClick={handleTryAgain}
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
                onClick={() => {
                  navigate(`/${Config.perfix}/forgot-password`);
                }}
              >
                {t.FORGOT_PASSWORD}
              </Button>
            </Flex>
          </Form>
        </Card>
      </Layout.Content>
      <Layout.Footer className="login-page__footer">
        <GithubOutlined />
        <small>V{Config.panelVersion}</small>
      </Layout.Footer>
    </Layout>
  );
};

export default Login;
