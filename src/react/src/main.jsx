import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { App } from "antd";

import MyApp from "./MyApp";
import { LanguageProvider } from "./context/LanguageContext";

import "./assets/index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24,
      retry: false,
      refetchOnWindowFocus: false,
      // when upload window opens the webiste loses focus and therefore when upload window closess
      // some of the queries will refetch and app flow will be ruined !!!
      onError: (err) => {
        // console.log("🚀 ~ file: index.js:29 ~ err:", err);
      },
    },
  },
});

console.log(`TIRDAD ABBASI AND MEHRDAD ABBASI`);

const NotificationInitializer = () => {
  const { notification } = App.useApp();

  React.useEffect(() => {
    setNotificationApi(notification);
  }, [notification]);

  return null;
};


root.render(
  <App>
    
    <NotificationInitializer />
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <MyApp />
        {process.env.NODE_ENV !== "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </LanguageProvider>
    </QueryClientProvider>
  </App>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
