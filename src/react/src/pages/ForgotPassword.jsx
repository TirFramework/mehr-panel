import { useState } from "react";
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

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSetPassword, setShowSetPassword] = useState("");

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
        navigate(`/${Config.perfix}/login`);
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
            <img src="" alt="Login" />
          </div>

          {!showSetPassword ? (
            <Form
              name="basic"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={onFinishForgotPassword}
            >
              <Typography.Title className="page-index__title">
                Forget Password
              </Typography.Title>

              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Email"
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
                  Submit
                </Button>
              </Form.Item>
              <Flex gap="middle" justify="center">
                <Button
                  type="link"
                  onClick={() => {
                    setShowSetPassword("");
                    navigate(`/${Config.perfix}/login`);
                  }}
                >
                  Back to login
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
                Reset Password
              </Typography.Title>

              <Form.Item
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Please input your code!",
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
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Password"
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
                    message: "Please input your password confirmation",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Password"
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
                  Submit
                </Button>
              </Form.Item>

              <Flex gap="middle" justify="center">
                <Button
                  type="link"
                  onClick={() => {
                    setShowSetPassword("");
                    navigate(`/${Config.perfix}/login`);
                  }}
                >
                  Back to login
                </Button>
                <Button
                  type="link"
                  onClick={() => {
                    setShowSetPassword("");
                  }}
                >
                  Change Email
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
