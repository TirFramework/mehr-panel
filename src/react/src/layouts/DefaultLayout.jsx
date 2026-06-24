import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import { Alert, Button, Col, Layout, Row, Space, Spin, Typography } from "antd";

import { LoadingOutlined } from "@ant-design/icons";
import Sidebar from "../blocks/Sidebar";
import TopHeader from "../blocks/TopHeader";
import { useIsFetching } from "@tanstack/react-query";
import { useAddFcmToken, useGeneralQuery } from "../Request/index";
import useLocalStorage from "../hooks/useLocalStorage";
import { fetchToken } from "../lib/firebase.js";
import Config from "../constants/config.js";
import { useLanguage } from "../context/LanguageContext";

function DefaultLayout(props) {
  const addFcmToken = useAddFcmToken();
  const isFetching = useIsFetching();
  const [token, setToken] = useLocalStorage("fcmToken");
  const [loading, setLoading] = useState(false);
  const { changeLanguage } = useLanguage();

  const { data, ...generalQuery } = useGeneralQuery();

  // Apply the language sent by the backend as soon as the topbar data loads
  useEffect(() => {
    if (data?.lang) {
      changeLanguage(data.lang);
    }
  }, [data?.lang]);

  return (
    <>
      <div className={`flex panel-${Config.perfix}`}>
        {isFetching ? (
          <Spin
            className="isFetching"
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
          />
        ) : (
          ""
        )}

        {generalQuery.isLoading ? (
          <>
            <Layout>
              <Layout.Content className="loading-container">
                <Spin size="large" />

                <Typography.Title level={3} className="loading-container__text">
                  Loading
                </Typography.Title>
              </Layout.Content>
            </Layout>
          </>
        ) : (
          <Layout>
            <TopHeader {...data} />
            <Layout>
              <Sidebar />
              <Layout.Content>
                <Outlet />
              </Layout.Content>
            </Layout>
          </Layout>
        )}
      </div>
      {!token.token && Config.firebase.projectId && (
        <div className="firebase-notification-confirm">
          <Alert
            showIcon={false}
            message={
              <>
                <div className="firebase-notification-confirm__title">
                  Do you want to enable device notifications?
                </div>
                <Row justify={"end"}>
                  <Col>
                    <Space>
                      <Button
                        onClick={() => {
                          setToken({ token: "close" });
                        }}
                      >
                        Close
                      </Button>
                      <Button
                        type="primary"
                        loading={loading}
                        onClick={() => {
                          setLoading(true);
                          Notification.requestPermission()
                            .then((permission) => {
                              if (permission === "granted") {
                                // if Permission is allowed then getting firebase messanging token from firebase
                                fetchToken().then((fcm_token) => {
                                  // console.log(
                                  //   "🚀 ~ fetchToken ~ fcm_token:",
                                  //   fcm_token
                                  // );
                                  // displaying token in index file
                                  addFcmToken.mutate(
                                    { fcm_token: fcm_token },
                                    {
                                      onSuccess: () => {
                                        setToken({ token: fcm_token });
                                        setLoading(false);
                                      },
                                    }
                                  );
                                });
                              } else {
                                // console.log(
                                //   "🚀 ~ .then ~ Permission not granted"
                                // );
                              }
                            })
                            .catch((e) => {
                              console.log(
                                "🚀 ~ .then ~ Permission not granted",
                                e
                              );
                            });
                        }}
                      >
                        Enable
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </>
            }
            banner
          />
        </div>
      )}
    </>
  );
}

export default DefaultLayout;
