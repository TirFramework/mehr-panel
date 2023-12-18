import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";

import { App } from "antd";

// import "./assets/tailwindbasic.css";
// import "antd/dist/antd.min.css"; // or 'antd/dist/antd.less'
import "./assets/index.css";
import MyApp from "./MyApp";

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

root.render(
  <App>
    <QueryClientProvider client={queryClient}>
      <MyApp />
    </QueryClientProvider>
  </App>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
