import { notification } from "antd";
import { clearApiToken } from "../authToken";
import Config from "../../constants/config";
import { getNotificationApi } from "../notificationService";
import { getT } from "../../context/LanguageContext";

const DEFAULT_DURATION = 10;

const buildDescription = (messages) => {
  if (!messages.length) {
    return undefined;
  }

  return (
    <ul style={{ margin: 0, paddingInlineStart: 20 }}>
      {messages.map((message, index) => (
        <li key={`${message}-${index}`}>{message}</li>
      ))}
    </ul>
  );
};

const normalizeDuration = (value) => {
  if (value === undefined || value === null) {
    return DEFAULT_DURATION;
  }
  if (value === "undefined") {
    return DEFAULT_DURATION;
  }
  const numeric = Number(value);
  return Number.isNaN(numeric) ? DEFAULT_DURATION : numeric;
};

const ErrorHandler = async (error) => {
  const response = error?.response;
  const data = response?.data;
  const t = getT(document.documentElement.lang || "en");

  const notifier = getNotificationApi() || notification;

  if (!response) {
    notifier.warning({
      message: t.ERROR_UNKNOWN,
      description: t.ERROR_NO_RESPONSE,
      duration: DEFAULT_DURATION,
    });
    return null;
  }

  // Handle Blob responses (e.g., file downloads with errors)
  if (data instanceof Blob) {
    try {
      const responseBlob = new Blob([data], { type: "application/json" });
      const jsonData = await responseBlob.text();
      response.data = JSON.parse(jsonData);
    } catch (parseError) {
      notifier.warning({
        message: t.ERROR_PARSE,
        description: t.ERROR_PARSE_DESC,
        duration: DEFAULT_DURATION,
      });
      return null;
    }
  }

  const messages = [];
  const normalizedData = response.data || {};

  if (normalizedData.message) {
    if (typeof normalizedData.message === "object") {
      Object.values(normalizedData.message).forEach((value) => {
        if (Array.isArray(value)) {
          messages.push(...value);
        } else if (value) {
          messages.push(String(value));
        }
      });
    } else {
      messages.push(String(normalizedData.message));
    }

    notifier.warning({
      message: normalizedData.title || t.ERROR_TITLE,
      description: buildDescription(messages),
      duration: normalizeDuration(normalizedData.duration),
    });
  } else {
    notifier.warning({
      message: t.ERROR_UNKNOWN,
      description: t.ERROR_GENERIC,
      duration: normalizeDuration(normalizedData.duration),
    });
  }

  if (normalizedData.redirect) {
    const currentPage = window.location.pathname + window.location.search;
    const redirectTarget = "/admin" + normalizedData.redirect;

    setTimeout(() => {
      if (currentPage !== redirectTarget) {
        window.location.replace(redirectTarget);
      }
    }, 500);
  }

  if (response.status === 401) {
    setTimeout(() => {
      if (window.location.pathname !== `/${Config.perfix}/login`) {
        window.location.replace(`/${Config.perfix}/login`);
      }
    }, 1000);

    clearApiToken();
  }

  return null;
};

export default ErrorHandler;
