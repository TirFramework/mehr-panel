import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { Button, Card, Row, Table, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";

import axios from "../lib/axios";

import * as api from "../api";

// const getColumns = async (query) => {
//   return fetch(`http://localhost:8000/post/index.json`).then((_) => _.json());
// }

const { Title } = Typography;

function Index() {
  const { pageModule } = useParams();

  const [columns, setColumns] = useState([]);

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  const getData = ({ page, results, filter = false }) => {
    // console.log("-------------------------------------- getData");
    // console.log("🚀 ~ file: Index.js ~ line 65 ~ getData ~ filter", filter);
    // console.log("🚀 ~ file: Index.js ~ line 65 ~ getData ~ results", results);
    // console.log("🚀 ~ file: Index.js ~ line 65 ~ getData ~ page", page);
    setLoading(true);

    axios
      .get(`${pageModule}/data`, {
        params: {
          page: page,
          results: results,
          filter: filter,
        },
      })
      .then((res) => {
        setData(res.data.data);
        // console.log( "🚀 ~ file: Index.js ~ line 48 ~ .then ~ res.data", res.data.data );
        setPagination({
          current: res.data.current_page,
          pageSize: res.data.per_page,
          total: res.data.total,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getColumns = () => {
    api
      .getCols()
      .then((res) => {
        console.log("🚀 ~ file: Index.js ~ line 69 ~ .then ~ res", res);
        let cols = res.cols;

        console.log("🚀 ~ file: Index.js ~ line 68 ~ .then ~ cols", cols);

        let react = React;

        for (let i = 0; i < cols.length; i++) {
          if (cols[i].render) {
            cols[i].render = eval(cols[i].render);
          }
        }

        let actions = {
          title: "Actions",
          dataIndex: "actions",
          render: (actions, data) => {
            return (
              <Link to={`/admin/user/edit/${data.id}`}>
                <EditOutlined title={actions.edit.name} />
              </Link>
            );
          },
        };

        cols.push(actions);
        console.log(
          "🚀 ~ file: Index.js ~ line 101 ~ .then ~ res.cols",
          res.cols
        );

        setColumns(res.cols);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const getColumns = () => {
  //   let cols = {
  //     cols: [
  //       {
  //         title: "Name",
  //         dataIndex: "name",
  //         sorter: true,
  //         filters: [],
  //         render: (name, data) => name + data.id,
  //       },
  //       {
  //         title: "Email",
  //         dataIndex: "email",
  //         sorter: true,
  //         filters: [],
  //       },
  //       {
  //         title: "Type",
  //         dataIndex: "type",
  //         sorter: true,
  //         filters: [],
  //       },
  //     ],
  //   };

  //   setColumns(cols.cols);
  // };

  useEffect(() => {
    async function makeTable() {
      await getColumns();

      await getData({
        page: pagination.current,
        results: pagination.pageSize,
      });
    }

    makeTable();
  }, [pageModule]);

  const handleTableChange = (pagination, filters, sorter) => {
    // console.log(
    //   "🚀 ~ file: Index.js ~ line 92 ~ handleTableChange ~ sorter",
    //   sorter
    // );
    // console.log(
    //   "🚀 ~ file: Index.js ~ line 92 ~ handleTableChange ~ filters",
    //   filters
    // );
    // console.log(
    //   "🚀 ~ file: Index.js ~ line 96 ~ handleTableChange ~ pagination",
    //   pagination
    // );
    getData({
      filter: {
        key: "gender",
        value: "male",
      },
      page: pagination.current,
      results: pagination.pageSize,
    });
  };

  return (
    <>
      <Row justify="space-between" align="bottom" className="mb-4">
        <Title>{pageModule}</Title>
        <Button type="primary">
          <Link to={`/admin/${pageModule}/create`}>Create {pageModule}</Link>
        </Button>
      </Row>
      <Card>
        <Table
          columns={columns}
          rowKey={(record) => record.id}
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>
    </>
  );
}

export default Index;
