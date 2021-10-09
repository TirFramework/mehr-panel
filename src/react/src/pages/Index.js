import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { Button, Card, Row, Table, Tag, Typography, Popover, notification } from "antd";
import { EditOutlined, QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";

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

  
  const deleteRow = (id)=>{
    setLoading(true);
    api.deleteRow(pageModule, id)
    .then((res) => {
      console.log("🚀 ~ file: Create.js ~ line 77 ~ .then ~ res", res)
      notification["success"]({
        message: res.message,
      });
      getData({ page: pagination.current, result: pagination.pageSize });
    })
    .catch((err) => {
      console.log("🚀 ~ file: Create.js ~ line 88 ~ onFinish ~ err", err);
      setLoading(false);
    });
  }

  const actions = {
    title: "Actions",
    dataIndex: "id",
    fixed: "right",
    render: (id) => (
      <>
        <Link to={`/admin/${pageModule}/${id}/edit`}>
          <EditOutlined title="Edit" />
        </Link>
        <Link className="ml-4" onClick={()=> deleteRow(id) }>
          <DeleteOutlined title="Delete" />
        </Link>
      </>
    ),
  };

  const getData = async ({ page, result, filters = null }) => {
    return api
      .getRows(pageModule, page, result, filters)
      .then((res) => {
        setData(res.data);
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
          if (col.valueType === "array") {
            col.render = (arr) =>
              arr?.map((item, index) => <Tag key={index}>{item.text}</Tag>);
          } else if (col.valueType === "object") {
            col.render = (arr) => arr?.text;
          }
          if (col.filters !== undefined) {
            col.filters?.map((item) => (item.text = item.label));
          }

          if (col.comment?.content !== undefined) {
            col.title = (
              <div>
                {col.title}{" "}
                <Popover
                  content={col.comment.content}
                  title={col.comment.title}
                >
                  {" "}
                  <QuestionCircleOutlined />{" "}
                </Popover>{" "}
              </div>
            );
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
      setLoading(true);
      setData();
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

  const list = [
    {
      id: 1,
      name: "admin",
      user_id: 1,
      email: "admin@tir.loc",
      email_verified_at: null,
      type: "admin",
      status: "enabled",
      created_at: null,
      updated_at: null,
      deleted_at: null,
    },
  ];

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
          footer={() => (
            <>
              {!loading && (
                <CSVLink
                  filename={"Expense_Table.csv"}
                  data={data}
                  className="btn btn-primary"
                >
                  Export to CSV
                </CSVLink>
              )}
            </>
          )}
        />
      </Card>
    </>
  );
}

export default Index;
