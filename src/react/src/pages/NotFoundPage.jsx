import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "antd";
import {
  HomeOutlined,
  ArrowLeftOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import { useLanguage } from "../context/LanguageContext";
import Config from "../constants/config";
import { getApiToken } from "../lib/authToken";

const { Title, Paragraph } = Typography;

const NotFoundPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isAuthenticated = !!getApiToken();

  const handleGoHome = () => {
    navigate(
      isAuthenticated
        ? `/${Config.perfix}/dashboard`
        : `/${Config.perfix}/login`
    );
  };

  return (
    <div className="not-found-page">
      <div className="not-found-page__glow not-found-page__glow--1" aria-hidden />
      <div className="not-found-page__glow not-found-page__glow--2" aria-hidden />

      <div className="not-found-page__content">
        <div className="not-found-page__icon" aria-hidden>
          <CompassOutlined />
        </div>

        <div className="not-found-page__code">404</div>

        <Title level={2} className="not-found-page__title">
          {t.NOT_FOUND_TITLE}
        </Title>

        <Paragraph className="not-found-page__desc">
          {t.NOT_FOUND_DESC}
        </Paragraph>

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
