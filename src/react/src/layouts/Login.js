
import { useState } from "react";
import Cookies from "js-cookie";
import axios from "../lib/axios";

import { useHistory } from "react-router-dom";

import { Form, Input, Button, notification, Row, Col } from "antd";

import { LockOutlined, UserOutlined } from "@ant-design/icons";

import * as api from "../api";



const Login = () => {
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const onFinish = (values) => {
    console.log("Success:", values);

    api
      .postLogin(values)
      .then((res) => {
        console.log("🚀 ~ file: Login.js ~ line 26 ~ .then ~ res", res)
        setLoading(false);
        notification["success"]({
          message: 'You have successfully logged',
        });
        login(res.api_token)
      })
      .catch((err) => {
        console.log("🚀 ~ file: Login.js ~ line 33 ~ onFinish ~ err", err)
        setLoading(false);
        notification["error"]({
          message: 'problem',
        });
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };



  const login = (token) => {
    Cookies.set("api_token", token);
    axios.defaults.headers.common = {'Authorization': `Bearer ${token}`}
    history.push("/admin/custom/dashboard");
  };

  return (
    <div className="h-screen flex items-center flex-col bg-contain bg-center">
      <div className="w-full max-w-sm m-auto flex-grow flex-col flex justify-center">

        <Form
          name="basic"
          className="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
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

      <p className="my-7 text-center login-footer">
        -
        <br />
        Copyright ©2021 Produced by - Finance Experience Technology
        Department
      </p>
    </div>
  );
};

export default Login;
