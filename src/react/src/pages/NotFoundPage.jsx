import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "antd";
import {
  HomeOutlined,
  ArrowLeftOutlined,
  CompassOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useLanguage } from "../context/LanguageContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import Config from "../constants/config";
import { getApiToken } from "../lib/authToken";

const { Title, Paragraph } = Typography;

/**
 * Access / missing page UI for failed module loads (404 or 403).
 * @param {{ status?: 404 | 403 }} props
 */
const NotFoundPage = ({ status = 404 }) => {
  const { t } = useLanguage();
  const isForbidden = status === 403;
  const title = isForbidden ? t.FORBIDDEN_TITLE : t.NOT_FOUND_TITLE;
  const description = isForbidden ? t.FORBIDDEN_DESC : t.NOT_FOUND_DESC;

  useDocumentTitle(title);
  const navigate = useNavigate();
  const isAuthenticated = !!getApiToken();

  const handleGoHome = () => {
    navigate(
      isAuthenticated
        ? `/${Config.prefix}/dashboard`
        : `/${Config.prefix}/login`
    );
  };

  return (
    <div
      className={`not-found-page${isForbidden ? " not-found-page--forbidden" : ""}`}
    >
      <div className="not-found-page__glow not-found-page__glow--1" aria-hidden />
      <div className="not-found-page__glow not-found-page__glow--2" aria-hidden />

      <div className="not-found-page__content">
        <div className="not-found-page__icon" aria-hidden>
          {isForbidden ? <StopOutlined /> : <CompassOutlined />}
        </div>

        <div className="not-found-page__code">{status}</div>

        <Title level={2} className="not-found-page__title">
          {title}
        </Title>

        <Paragraph className="not-found-page__desc">{description}</Paragraph>

        <div className="not-found-page__actions">
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            onClick={handleGoHome}
          >
            {t.GO_HOME}
          </Button>
          <Button
            size="large"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            {t.GO_BACK}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
