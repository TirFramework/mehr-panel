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
} from "antd";

import {
  LockOutlined,
  UserOutlined,
  GithubOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import * as api from "../api";
import Config from "../constants/config";

const Login = () => {
  const navigate = useNavigate();
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
        } else {
          notification["success"]({
            message: "You have successfully logged",
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
    Cookies.set("api_token", token);
    axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
    const version = window.localStorage.getItem("version");

    if (version !== Config.panelVersion) {
      localStorage.clear();
      window.localStorage.setItem("version", Config.panelVersion);
    }
    navigate("/admin/custom/dashboard");
  };

  return (
    <Layout>
      <Layout.Content className="login-page">
        <Card>
          <div className="illustration-wrapper">
            <img src="" alt="Login" />
          </div>

          <Form
            name="basic"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Typography.Title className="page-index__title">
              Welcome back
            </Typography.Title>

            <Typography.Paragraph>Login to the Dashboard</Typography.Paragraph>

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

            <Form.Item
              name="password"
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

            {mustVerify && (
              <Form.Item
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Please input your verification code!",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Verification Code"
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
                Sign In
              </Button>
            </Form.Item>

            {mustVerify && (
              <Form.Item>
                <Button
                  onClick={handleTryAgain}
                  className="w-full"
                  type="secondary"
                >
                  Did not received the code? Try Again
                </Button>
              </Form.Item>
            )}
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
