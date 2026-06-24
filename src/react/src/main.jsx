import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { notification } from "antd";
import responseErrorHandler from "./lib/helpers/responseErrorHandler";

import MyApp from "./MyApp";
import { LanguageProvider } from "./context/LanguageContext";
import { getNotificationApi } from "./lib/notificationService";

import "./assets/index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24,
      retry: false,
      refetchOnWindowFocus: false,
      onError: (err) => {
        // console.log("🚀 ~ file: index.js:29 ~ err:", err);
      },
    },
    mutations: {
      onError: (err) => {
        const error = responseErrorHandler(err);
        const notify = getNotificationApi() || notification;
        notify.error({
          message: error.message,
          duration: error.duration,
          description: error.description,
        });
      },
    },
  },
});

console.log(`TIRDAD ABBASI AND MEHRDAD ABBASI`);

root.render(
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <MyApp />
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </LanguageProvider>
  </QueryClientProvider>
);
