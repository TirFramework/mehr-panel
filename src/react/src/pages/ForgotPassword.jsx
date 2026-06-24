import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "../lib/axios";
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

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [showSetPassword, setShowSetPassword] = useState("");

  useDocumentTitle(
    showSetPassword ? t.RESET_PASSWORD_TITLE : t.FORGET_PASSWORD_TITLE
  );

  const onFinishForgotPassword = (values) => {
    setLoading(true);
    api
      .postForgotPassword(values)
      .then((res) => {
        setLoading(false);
        setShowSetPassword(values.email);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const onFinishResetPassword = (values) => {
    setLoading(true);
    api
      .postResetPassword({
        email: showSetPassword,
        ...values,
      })
      .then((res) => {
        setLoading(false);
        setShowSetPassword("");
        navigate(`/${Config.prefix}/login`);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <Layout>
      <Layout.Content className="login-page">
        <Card>
          <div className="illustration-wrapper">
            <img src="" alt={t.LOGIN_ALT_IMAGE} />
          </div>

          {!showSetPassword ? (
            <Form
              name="basic"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={onFinishForgotPassword}
            >
              <Typography.Title className="page-index__title">
                {t.FORGET_PASSWORD_TITLE}
              </Typography.Title>

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
                    setShowSetPassword("");
                    navigate(`/${Config.prefix}/login`);
                  }}
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
              <Typography.Title className="page-index__title">
                {t.RESET_PASSWORD_TITLE}
              </Typography.Title>

              <Form.Item
                name="code"
                rules={[
                  {
                    required: true,
                    message: t.VALIDATION_CODE,
                  },
                ]}
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
              <Form.Item
                name="password-confirmation"
                autoComplete="new-password"
                dependencies={["password"]}
                // hasFeedback
                rules={[
                  {
                    required: true,
                    message: t.VALIDATION_PASSWORD_CONFIRM,
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(t.PASSWORDS_DONT_MATCH)
                      );
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
                    setShowSetPassword("");
                    navigate(`/${Config.prefix}/login`);
                  }}
                >
                  {t.BACK_TO_LOGIN}
                </Button>
                <Button
                  type="link"
                  onClick={() => {
                    setShowSetPassword("");
                  }}
                >
                  {t.CHANGE_EMAIL}
                </Button>
              </Flex>
            </Form>
          )}
        </Card>
      </Layout.Content>
      <Layout.Footer className="login-page__footer">
        <GithubOutlined />
        <small>V{Config.panelVersion}</small>
      </Layout.Footer>
    </Layout>
  );
};

export default ForgotPassword;
