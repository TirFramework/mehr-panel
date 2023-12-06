import React from "react";
import { Outlet } from "react-router-dom";

import { Layout, Spin, Typography } from "antd";

import { LoadingOutlined } from "@ant-design/icons";
import Sidebar from "../blocks/Sidebar";
import TopHeader from "../blocks/TopHeader.js";
import { useIsFetching } from "react-query";
import { useGeneralQuery } from "../Request/index.js";

const { Content } = Layout;

function DefaultLayout(props) {
  const isFetching = useIsFetching();

  const { data, ...generalQuery } = useGeneralQuery();

  return (
    <div className="flex">
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
          <TopHeader name={data?.name} username={data?.username} />
          <Layout>
            <Sidebar />
            <Layout.Content>
              <Outlet />
            </Layout.Content>
          </Layout>
        </Layout>
      )}
    </div>
  );
}

export default DefaultLayout;
