import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { PlusOutlined, StopOutlined } from "@ant-design/icons";

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

// const getColumns = async (query) => {
//   return fetch(`http://localhost:8000/post/index.json`).then((_) => _.json());
// }

const { Title } = Typography;

function Index() {
    console.log("🚀 ~ Index");
    const { pageModule } = useParams();

    const history = useHistory();

    if (!localStorage.getItem(pageModule)) {
        localStorage.setItem(
            pageModule,
            JSON.stringify({
                current: 1,
                pageSize: 15,
                total: 0,
                search: null,
                filters: null,
            })
        );
    }
    const [columns, setColumns] = useState();

    const [data, setData] = useState();

    const [dataLoading, setDataLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(true);

    const [pagination, setPagination] = useLocalStorage(pageModule);

    const deleteRow = (id) => {
        setTableLoading(true);
        api
            .deleteRow(pageModule, id)
            .then((res) => {
                // console.log("🚀 ~ file: Create.js ~ line 77 ~ .then ~ res", res)
                notification["success"]({
                    message: res.message,
                });
                //TODO:: pagination problem after delete the item
                setTableLoading(false);
                getData(pagination);
            })
            .catch((err) => {
                // console.log("🚀 ~ file: Create.js ~ line 88 ~ onFinish ~ err", err);
                setTableLoading(false);
            });
    };

    const actions = {
        title: "Actions",
        dataIndex: "id",
        fixed: "right",
        render: (id, data) => (
            <>
                <Link to={`/admin/${pageModule}/create-edit?id=${data.id || data._id}`}>
                    <EditOutlined title="Edit" />
                </Link>
                <Tooltip title="Delete">
                    <Button
                        className="ml-4"
                        type="link"
                        danger
                        onClick={() => deleteRow(data.id || data._id)}
                        icon={<DeleteOutlined />}
                    />
                </Tooltip>
            </>
        ),
    };

    const getColumns = (params) => {
        setTableLoading(true);
        api
            .getCols(pageModule)
            .then((res) => {
                let cols = res.cols;
                // loop for detect array
                cols.forEach((col) => {
                    var item;

                    col.dataIndex = col.dataIndex.split('.');

                    if (params?.filters?.hasOwnProperty(col.dataIndex)) {
                        item = params?.filters[col.dataIndex];
                        col.defaultFilteredValue = item;
                    }

                    if (col.valueType === "array") {
                        col.render = (arr) =>
                            arr?.map((item, index) => <Tag key={index}>{item}</Tag>);
                    } else if (col.valueType === "object") {
                        col.render = (arr) => arr?.text;
                    }
                    if (col.filters !== undefined) {
                        col.filters?.map((item) => (item.text = item.label));

                        col.filterSearch= col.filters.length > 10;

                    }

                    if (col.dataSet.length !== 0) {
                        col.render = (data) => {
                          if (typeof data === "object" && data) {
                            return (
                              <>
                                {data.map(function (item, index){
                                    if(col.dataKey){
                                        item = item[col.dataKey ]
                                    }
                                    return (
                                    <Tag key={index}>{ col.dataSet[item]}</Tag>
                                    )
                                })}
                              </>
                            );
                          } else {
                            return <>{col.dataSet[data]}</>;
                          }
                        };
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
                cols.push(actions);

                setColumns(res);
                setTableLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
        getData(params);
    };

    useEffect(() => {
        getColumns(pagination);
    }, [pageModule]);

    const getData = useCallback(
        (params) => {
            setDataLoading(true);
            api
                .getRows(pageModule, params)
                .then((res) => {
                    if(!res.data.length){
                        setPagination({
                            ...pagination,
                            current : 1
                        })
                    }
                    setData(res);
                    setDataLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        [pageModule, pagination]
    );

    const handleTableChange = (p, filters, sorter) => {
        console.log("🚀 ~ file: Index.js:175 ~ handleTableChange ~ p", p);
        filters = helpers.removeNullFromObject(filters);
        setPagination({
            ...pagination,
            current: p.current,
            pageSize: p.pageSize,
            filters: filters,
        });
        getData({
            ...pagination,
            current: p.current,
            pageSize: p.pageSize,
            filters: filters,
        });
    };

    const onSearch = (value) => {
        if (value === "") {
            value = null;
        }
        setPagination({
            ...pagination,
            search: value,
        });
        getData({
            ...pagination,
            search: value,
        });
    };

    return (
        <div className={`${pageModule}-index`}>
            <Title className="capitalize">{pageModule}</Title>
            <Row align="bottom" className="mb-4">
                <Col className="gutter-row" span={12}>
                    {!tableLoading ? (
                        <Input.Search
                            placeholder="Search"
                            onSearch={onSearch}
                            defaultValue={pagination.search}
                            allowClear
                            enterButton
                            size="large"
                        />
                    ) : (
                        <Skeleton.Input
                            active={true}
                            className="w-full"
                            style={{ width: "100%" }}
                        />
                    )}
                </Col>
                <Col className="gutter-row" span={8}>
                    {pagination?.filters && (
                        <>
                            {Object.keys(pagination?.filters).length ? (
                                <Button
                                    icon={<StopOutlined />}
                                    type="default"
                                    onClick={() => {
                                        const newPagination = {
                                            ...pagination,
                                            current: 1,
                                            filters: null,
                                        };
                                        setPagination(newPagination);
                                        getColumns(newPagination);
                                        getData(newPagination);
                                    }}
                                >
                                    Reset
                                </Button>
                            ) : (
                                ""
                            )}
                        </>
                    )}
                </Col>
                {columns?.actions?.create && (
                    <Col className="gutter-row text-right" span={4}>
                        <Link to={`/admin/${pageModule}/create-edit`}>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                loading={tableLoading}
                            >
                                Create {pageModule}
                            </Button>
                        </Link>
                    </Col>
                )}
            </Row>
            <Card loading={tableLoading}>
                <Table
                    columns={columns?.cols}
                    rowKey={(record) => record.id}
                    dataSource={data?.data}
                    pagination={{
                        pageSize: pagination?.pageSize,
                        current: pagination?.current,
                        total: data?.total,
                    }}
                    // onRow={(record, rowIndex) => {
                    //   return {
                    //     onClick: (event) => {
                    //       history.push(
                    //         `/admin/${pageModule}/create-edit?id=${record.id}`
                    //       );
                    //     }, // click row
                    //   };
                    // }}
                    // rowClassName={"cursor-pointer	"}
                    loading={dataLoading}
                    onChange={handleTableChange}
                    footer={() => (
                        <>
                            {!dataLoading && (
                                <CSVLink
                                    filename={"Expense_Table.csv"}
                                    data={data?.data}
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
