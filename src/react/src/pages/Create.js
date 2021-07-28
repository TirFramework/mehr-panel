import DefaultLayout from "../layouts/DefaultLayout";
// import Input from "../components/Input";

import React, { lazy, useEffect, useState } from "react";
// import shortid from 'shortid';
import { useHistory, useParams } from 'react-router-dom'

import { Form, Button, Breadcrumb } from "antd";




const importView = (subreddit) =>
  lazy(() => import(`../components/${subreddit}`).catch(() => import(`./404`)));

const searchSubreddit = async (query) => {
  return fetch(`http://localhost:8000/${query}/fields.json`).then((_) => _.json());
}

function Create({ subredditsToShow }) {

  const { pageType } = useParams()


  const [views, setViews] = useState([]);

  const extractData = (response) => {
    return response.data.map(({ data }) => data);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    async function loadViews() {
      const subredditsToShow = await searchSubreddit(pageType).then(
        extractData
      );
      const componentPromises = subredditsToShow.map(async (data) => {
        const View = await importView(data.subreddit);
        return <View key={data.key} {...data} />;
      });

      Promise.all(componentPromises).then(setViews);
    }

    loadViews();
  }, [subredditsToShow]);

  return (
    <DefaultLayout >
      <Breadcrumb>
        <Breadcrumb.Item className="capitalize">{pageType}</Breadcrumb.Item>
        <Breadcrumb.Item>Create</Breadcrumb.Item>
      </Breadcrumb>

      <React.Suspense fallback="Loading views...">
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          {views}
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </React.Suspense>
    </DefaultLayout>
  );
}

export default Create;
