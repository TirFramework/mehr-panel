import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { Button, Card, Row, Table, Tag, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";

import * as helpers from "../lib/helpers";

import * as api from "../api";

// const getColumns = async (query) => {
//   return fetch(`http://localhost:8000/post/index.json`).then((_) => _.json());
// }

const { Title } = Typography;

function Index() {
  const { pageModule } = useParams();

  const [columns, setColumns] = useState();

  const [data, setData] = useState();

  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  const actions = {
    title: "Actions",
    dataIndex: "id",
    fixed: "right",
    render: (id) => (
      <Link to={`/admin/${pageModule}/${id}/edit`}>
        <EditOutlined title="Edit" />
      </Link>
    ),
  };

  const getData = async ({ page, result, filters = null }) => {
    return api
      .getRows(pageModule, page, result, filters)
      .then( (res) => {
        setData(res.data)
        setPagination({
          current: res.current_page,
          pageSize: res.per_page,
          total: res.total,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getColumns = () => {
      api
        .getCols(pageModule)
        .then((res) => {
          let cols = res.cols;
          // loop for detect array
          cols.forEach((col) => {
            if (col.valueType === 'array') {
              col.render = (arr) => arr?.map((item, index) => <Tag key={index}>{item.text}</Tag>);
            } else if (col.valueType === 'object') {
              col.render = (arr) => arr?.text;
            }
          });
          // add edit to row
          cols.push(actions);
          setColumns(res.cols);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  useEffect(() => {
    (async () => {
      setLoading(true)
      setData()
      await getColumns();
      await getData({ page: pagination.current, result: pagination.pageSize });
    })();
  }, [pageModule]);


  // useEffect(() => {
  //   getColumns()
  // }, [data])




  const handleTableChange = (pagination, filters, sorter) => {
    filters = helpers.removeNullFromObject(filters);
    getData({
      filters: filters,
      page: pagination.current,
      result: pagination.pageSize,
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
