import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import {
  Button,
  Card,
  Row,
  Table,
  Input,
  Tag,
  Typography,
  Popover,
  notification,
  Col, Tooltip,
} from "antd";
import {
  EditOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
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

  const [search, setSearch] = useState(null);

  const [filters, setFilters] = useState(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  const deleteRow = (id) => {
    setLoading(true);
    api
      .deleteRow(pageModule, id)
      .then((res) => {
        // console.log("🚀 ~ file: Create.js ~ line 77 ~ .then ~ res", res)
        notification["success"]({
          message: res.message,
        });
        //TODO:: pagination problem after delete the item
        getData({ page: pagination.current, result: pagination.pageSize });
      })
      .catch((err) => {
        // console.log("🚀 ~ file: Create.js ~ line 88 ~ onFinish ~ err", err);
        setLoading(false);
      });
  };

  const actions = {
    title: "Actions",
    dataIndex: "id",
    fixed: "right",
    render: (id) => (
      <>
        <Link to={`/admin/${pageModule}/${id}/edit`}>
          <EditOutlined title="Edit" />
        </Link>
        <Tooltip title="Delete">
          <Button  className="ml-4" type="link" danger onClick={() => deleteRow(id)} icon={<DeleteOutlined />} />
        </Tooltip>
      </>
    ),
  };

  const getData = async ({ page, result, filters = null, search = null }) => {
    return api
      .getRows(pageModule, page, result, filters, search)
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
                {col.title}
                <Popover
                  content={col.comment.content}
                  title={col.comment.title}
                >
                  <QuestionCircleOutlined />
                </Popover>
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

    setData();
    setSearch();
    setFilters();
    setPagination({
      current: 1,
      pageSize: 15,
      total: 0,
    });


    (async () => {
      console.log("🚀 ~ file: Index.js ~ line 144 ~ useEffect ~ useEffect")
      setLoading(true);
      await getColumns();
      await getData({ page: 1, result: 15 });
    })();
  }, [pageModule]);

  const handleTableChange = (pagination, filters, sorter) => {
    filters = helpers.removeNullFromObject(filters);
    setFilters(filters);
    getData({
      filters: filters,
      page: pagination.current,
      result: pagination.pageSize,
      search: search,
    });
  };

  const onSearch = (value) => {
    if (value === "") {
      value = null;
    }
    setSearch(value);
    getData({
      filters: filters,
      page: pagination.current,
      result: pagination.pageSize,
      search: value,
    });
  };

  return (
    <div className={`${pageModule}-index`}>
      <Title className="capitalize">{pageModule}</Title>
      <Row justify="space-between" align="bottom" className="mb-4">
        <Col className="gutter-row" span={12}>
          <Input.Search placeholder="Search" onSearch={onSearch} />
        </Col>
        <Col className="gutter-row text-right" span={4}>
          <Button type="primary">
            <Link to={`/admin/${pageModule}/create`}>Create {pageModule}</Link>
          </Button>
        </Col>
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
    </div>
  );
}

export default Index;
