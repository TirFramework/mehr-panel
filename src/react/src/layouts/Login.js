import { useState } from "react";
import Cookies from "js-cookie";
import axios from "../lib/axios";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, notification } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import * as api from "../api";

const Login = () => {
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const onFinish = (values) => {
    localStorage.clear();

    api
      .postLogin(values)
      .then((res) => {
        setLoading(false);
        notification["success"]({
          message: "You have successfully logged",
        });
        login(res.api_token);
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
    history.push("/admin/custom/dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-box">
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
          <p className="form-title">Welcome back</p>
          <p>Login to the Dashboard</p>

          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input placeholder="Email" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
