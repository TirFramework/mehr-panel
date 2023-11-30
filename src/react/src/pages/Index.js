import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { PlusOutlined, ClearOutlined, EyeOutlined } from "@ant-design/icons";

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
  Col,
  Tooltip,
  Skeleton,
  Select,
} from "antd";
import {
  EditOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { CSVLink } from "react-csv";

import * as helpers from "../lib/helpers";

import * as api from "../api";
import useLocalStorage from "../hooks/useLocalStorage";
import { useGetColumns, useGetData } from "../Request";
import { defaultFIlter } from "../constants/config";
import { useQueryClient } from "react-query";

const { Title } = Typography;

function Index() {
  const { pageModule } = useParams();
  const [pagination, setPagination] = useLocalStorage(pageModule);
  console.log(
    `🚀 ~ file: Index.js:40 ~ Index ~ pagination: ${pageModule}`,
    pagination
  );

  useEffect(() => {}, [pageModule]);

  const [column, setColumn] = useState([]);

  const { data: pageData, ...pageDataQuery } = useGetColumns(
    pageModule,
    pagination,
    {
      onSuccess: (res) => {
        //   console.log("🚀 ~ file: Index.js:136 ~ Index ~ res:", res);
        res.cols.forEach(() => {
          const newData = [...res.cols];
          newData.forEach((col) => {
            col.filteredValue = pagination.filters[col.fieldName] || null;
          });
          setColumn(newData);
        });
      },
    }
  );
  const { data: indexData, ...dataQuery } = useGetData(pageModule, pagination, {
    onSuccess: (res) => {
      //   console.log("🚀 ~ file: Index.js:136 ~ Index ~ res:", res);
    },
  });

  //   const handleChangeColumns = (activeCols) => {
  //     // setTableLoading(true);
  //     setActiveColumn(activeCols);
  //     // getData(pagination);

  //     // getColumns(pagination);
  //     // console.log("activeCols", activeCols);
  //     // console.log("columnList", columnList);
  //     // console.log("columnList", activeCols);
  //     // setTableLoading(false);
  //   };

  const handleTableChange = (p, filters, sorter) => {
    filters = helpers.removeNullFromObject(filters);
    // const orderBy = {
    //   field: sorter?.column?.fieldName,
    //   order: sorter.order,
    // };

    setPagination({
      ...pagination,
      current: p.current,
      pageSize: p.pageSize,
      filters: filters,
      // sorter: orderBy,
    });

    const newData = [...column];

    newData.forEach((col) => {
      col.filteredValue = filters[col.fieldName] || null;
    });

    setColumn(newData);
  };

  const onSearch = (value) => {
    if (value === "") {
      value = null;
    }
    setPagination({
      ...pagination,
      search: value,
      current: 1,
    });
  };

  return (
    <div className={`${pageModule}-index page-index`}>
      <Title>{pageData?.configs?.module_title}</Title>
      {pageDataQuery.isLoading ? (
        <>
          <Skeleton.Input
            active={true}
            size="large"
            className="w-full"
            style={{ width: "200px", height: "40px", marginBottom: "16px" }}
          />
          <Skeleton.Input
            active={true}
            size="large"
            className="w-full"
            style={{ width: "100%", height: "40px", marginBottom: "16px" }}
          />
        </>
      ) : (
        <Row align="bottom" className="mb-4">
          <Col className="gutter-row" span={12}>
            <Input.Search
              placeholder="Search"
              onSearch={onSearch}
              defaultValue={pagination.search}
              allowClear
              enterButton
              size="large"
            />
          </Col>
          <Col className="gutter-row" span={2}>
            {(Object.keys(pagination?.filters).length > 0 ||
              pagination.search) && (
              <Button
                icon={<ClearOutlined />}
                type="primary"
                size="large"
                danger
                onClick={() => {
                  setPagination(defaultFIlter);
                  const newData = [...column];
                  newData.forEach((col) => {
                    col.filteredValue = null;
                  });

                  setColumn(newData);
                }}
              />
            )}
          </Col>
          <Col className="gutter-row" span={6}>
            {/* <Select
              mode="multiple"
              allowClear
              style={{
                width: "100%",
              }}
              placeholder="Please select"
              // defaultValue={['a10', 'c12']}
              onChange={handleChangeColumns}
              options={columnList}
            /> */}
          </Col>
          {pageData?.actions?.create && (
            <Col className="gutter-row text-right" span={4}>
              <Link to={`/admin/${pageModule}/create-edit`}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  loading={pageDataQuery.isLoading}
                >
                  {pageData?.configs?.module_title}
                </Button>
              </Link>
            </Col>
          )}
        </Row>
      )}
      <Card loading={pageDataQuery.isLoading} className="index-page__card">
        <Table
          scroll={{ y: "calc(100vh - 400px)" }}
          columns={column}
          rowKey={(record) => record.id || record._id}
          dataSource={indexData?.data}
          pagination={{
            pageSize: pagination?.pageSize,
            current: pagination?.current,
            pageSizeOptions: ["15", "30", "50", "100", "500"],
            total: indexData?.total,
            showTotal: (total) => <Button>Total: {indexData?.total}</Button>,
          }}
          loading={dataQuery.isLoading}
          onChange={handleTableChange}
          footer={() => (
            <>
              {!dataQuery.isLoading && indexData?.data && (
                <CSVLink
                  filename={"Expense_Table.csv"}
                  data={indexData?.data}
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
