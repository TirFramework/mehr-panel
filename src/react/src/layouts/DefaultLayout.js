import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect, Outlet } from "react-router-dom";

import { Layout, Spin } from "antd";

import routes from "../routes.js";
import { LoadingOutlined } from "@ant-design/icons";
import Sidebar from "../blocks/Sidebar";
import TopHeader from "../blocks/TopHeader.js";
import * as api from "../api";
import { useIsFetching } from "react-query";

const { Content } = Layout;

function DefaultLayout(props) {
  const isFetching = useIsFetching();

  const [general, setGeneral] = useState();
  // const [loading, setLoading] = useState(true);

  const makeGeneral = () => {
    return api
      .getGeneral()
      .then((res) => {
        setGeneral(res);
        // setLoading(false);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    async function makeHeader() {
      await makeGeneral();
    }
    makeHeader();
  }, []);

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

      <Sidebar name={general?.name} />
      <Layout className="site-layout">
        <div className="flex flex-col h-screen">
          <TopHeader username={general?.username} />
          <Content className="mp-main p-4">
            <Outlet />
          </Content>
          {/* <Footer/> */}
        </div>
      </Layout>
    </div>
  );
}

export default DefaultLayout;
