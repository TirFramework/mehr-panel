import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { App } from "antd";

// import "./assets/tailwindbasic.css";
// import "antd/dist/antd.min.css"; // or 'antd/dist/antd.less'
import "./assets/index.css";
import MyApp from "./MyApp";
import { LanguageProvider } from "./context/LanguageContext";

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

console.log(
  `    _      _                  _   ____               _    _                       \n     /\    | |    | |                (_) |  _ \             | |  | |                      \n    /  \   | |__  | |__    __ _  ___  _  | |_) | _ __  ___  | |_ | |__    ___  _ __  ___  \n   / /\ \  | '_ \ | '_ \  / _' |/ __|| | |  _ < | '__|/ _ \ | __|| '_ \  / _ \| '__|/ __| \n  / ____ \ | |_) || |_) || (_| |\__ \| | | |_) || |  | (_) || |_ | | | ||  __/| |   \__ \ \n /_/    \_\|_.__/ |_.__/  \__,_||___/|_| |____/ |_|   \___/  \__||_| |_| \___||_|   |___/`
);

root.render(
  <App>
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
