import React from "react";
import { Card, Layout, Typography } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import Config from "../constants/config";
import Slot from "../components/Slot";

/**
 * Shared chrome for login / forgot-password.
 * Compose via props, or drop slot files:
 *   dynamic-slots/LoginHeader.jsx
 *   dynamic-slots/LoginExtra.jsx
 */
function AuthShell({
  className = "login-page",
  title,
  subtitle,
  header,
  children,
  extra,
  footer,
  showDefaultFooter = true,
}) {
  return (
    <Layout>
      <Layout.Content className={className}>
        <Card>
          <Slot name="LoginHeader" />
          {header}
          {title != null && title !== false && (
            <Typography.Title className="page-index__title">
              {title}
            </Typography.Title>
          )}
          {subtitle != null && subtitle !== false && (
            <Typography.Paragraph>{subtitle}</Typography.Paragraph>
          )}
          {children}
          {extra}
          <Slot name="LoginExtra" />
        </Card>
      </Layout.Content>
      {(footer != null || showDefaultFooter) && (
        <Layout.Footer className="login-page__footer">
          {footer ?? (
            <>
              <GithubOutlined />
              <small>V{Config.panelVersion}</small>
            </>
          )}
        </Layout.Footer>
      )}
    </Layout>
  );
}

export default AuthShell;
