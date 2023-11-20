import React, {useState, useEffect, useCallback} from "react";
import {useParams, Link, useHistory} from "react-router-dom";
import {PlusOutlined, ClearOutlined, EyeOutlined} from "@ant-design/icons";

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
    Select
} from "antd";
import {
    EditOutlined,
    QuestionCircleOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import {CSVLink} from "react-csv";

import * as helpers from "../lib/helpers";

import * as api from "../api";
import useLocalStorage from "../hooks/useLocalStorage";
import moment from "moment";

// const getColumns = async (query) => {
//   return fetch(`http://localhost:8000/post/index.json`).then((_) => _.json());
// }

const {Title} = Typography;

function Index() {
    const {pageModule} = useParams();

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
                sorter: null,
            })
        );
    }
    const [columns, setColumns] = useState();

    const [data, setData] = useState();

    const [dataLoading, setDataLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(true);

    const [pagination, setPagination] = useLocalStorage(pageModule);

    const [activeColumn, setActiveColumn] = useState([]);

    const [columnList, setColumnList] = useState([]);

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

    const actions = (moduleActions)=>{
        const showAction = moduleActions.show;
        const editAction = moduleActions.edit;
        const deleteAction = moduleActions.destroy;
        return {
            title: "",
            dataIndex: "id",
            align: "right",
            render: (id, data) => {
                return (
                    <>
                        {showAction && <Link
                            to={`/admin/${pageModule}/detail?id=${data.id || data._id}`}
                            className="ant-btn ant-btn-link ant-btn-icon-only ml-4 showBtn"
                            style={{color: '#00921c'}}

                        >
                            <EyeOutlined title="Edit" />
                        </Link>}

                        {editAction && <Link
                            to={`/admin/${pageModule}/create-edit?id=${data.id || data._id}`}
                            className="ant-btn ant-btn-link ant-btn-icon-only ml-4 editBtn"
                        >
                            <EditOutlined title="Edit" />
                        </Link>}
                        {deleteAction && <Button
                            className={'ml-4'}
                            type="link"
                            danger
                            onClick={() => deleteRow(data.id || data._id)}
                            icon={<DeleteOutlined/>}
                        />}
                    </>
                )
            }
        }
    };

    const getColumns = (params) => {
        setTableLoading(true);
        api
            .getCols(pageModule)
            .then((res) => {
                let cols = res.cols;

                setColumnList(
                    cols.map((value)=>{
                    return ({ label: value.fieldName, value: value.fieldName });
                    })
                );


                // loop for detect array
                cols.forEach((col) => {
                    var item;

                    col.dataIndex = col.dataIndex.split(".");

                    if (params?.filters?.hasOwnProperty(col.dataIndex)) {
                        item = params?.filters[col.dataIndex];
                        col.defaultFilteredValue = item;
                    }

                    if (col.type === "DatePicker") {
                        col.render = (value) => {
                            if(value){
                                return moment(value).format(
                                    (!col.field.options?.showTime?.length)
                                        ? col.field.options.dateFormat
                                        : col.field.options.dateFormat + ' ' + col.field.options?.showTime
                                );
                            }
                        };
                    }

                    if (col.valueType === "array") {
                        col.render = (arr) =>
                            arr?.map((item, index) => <Tag key={index}>{item}</Tag>);
                    } else if (col.valueType === "object") {
                        col.render = (arr) => arr?.text;
                    }
                    if (col.filters !== undefined) {
                        col.filters?.map((item) => (item.text = item.label));

                        col.filterSearch = col.filters.length > 10;
                    }

                    if (col.dataSet.length !== 0) {
                        col.render = (data) => {
                            if (typeof data === "object" && data) {
                                return (
                                    <>
                                        {data.map(function (item, index) {
                                            if (col.dataKey) {
                                                item = item[col.dataKey];
                                            }
                                            return <Tag key={index}>{col.dataSet[item]}</Tag>;
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
                                    <QuestionCircleOutlined/>
                                </Popover>
                            </div>
                        );
                    }
                    col.sorter = col.field.sortable;
                    if(activeColumn.length > 0){
                        if(!activeColumn.includes(col.fieldName)) {
                            col.className = 'hidden'
                        }
                    }

                });
                cols.push(actions(res.configs.actions));

                setColumns(res);
                setTableLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
        getData(params);
    };

    const  handleChangeColumns = (activeCols) => {
        setTableLoading(true);
        setActiveColumn(activeCols);
        // getData(pagination);

        // getColumns(pagination);
        console.log('activeCols', activeCols);
        console.log('columnList', columnList);
        console.log('columnList', activeCols);
        setTableLoading(false);



    }

    useEffect(() => {
        getColumns(pagination);
    }, [pageModule, activeColumn]);

    const getData = useCallback(
        (params) => {
            setDataLoading(true);
            api
                .getRows(pageModule, params)
                .then((res) => {
                    if (!res.data.length) {
                        setPagination({
                            ...pagination,
                            current: 1,
                        });
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
        filters = helpers.removeNullFromObject(filters);
        const orderBy = {
            field: sorter?.column?.fieldName,
            order:sorter.order
        }

        setPagination({
            ...pagination,
            current: p.current,
            pageSize: p.pageSize,
            filters: filters,
            sorter: orderBy,
        });
        getData({
            ...pagination,
            current: p.current,
            pageSize: p.pageSize,
            filters: filters,
            sorter: orderBy,
        });
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
        getData({
            ...pagination,
            search: value,
            current: 1,
        });
    };


    return (
        <div className={`${pageModule}-index`}>
            <Title>{columns?.configs?.module_title}</Title>
            <Row align="bottom" className="mb-4">
                <Col className="gutter-row" span={12}>
                    {!tableLoading ? (
                        <Input.Search
                            placeholder=""
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
                            style={{width: "100%"}}
                        />
                    )}
                </Col>
                <Col className="gutter-row" span={2}>
                    {(pagination?.filters || pagination.search || pagination.sorter) && (
                        <Button
                            icon={<ClearOutlined/>}
                            type="primary"
                            size="large"
                            danger
                            onClick={() => {
                                const newPagination = {
                                    ...pagination,
                                    current: 1,
                                    filters: null,
                                    search: null,
                                    sorter: null,
                                };
                                setPagination(newPagination);
                                getColumns(newPagination);
                                getData(newPagination);
                            }}
                        ></Button>
                    )}
                </Col>
                <Col className="gutter-row" span={6}>
                    <Select
                        mode="multiple"
                        allowClear
                        style={{
                            width: '100%',
                        }}
                        placeholder="Please select"
                        // defaultValue={['a10', 'c12']}
                        onChange={handleChangeColumns}
                        options={columnList}
                    />
                </Col>
                {columns?.actions?.create && (
                    <Col className="gutter-row text-right" span={4}>
                        <Link to={`/admin/${pageModule}/create-edit`}>
                            <Button
                                type="primary"
                                icon={<PlusOutlined/>}
                                loading={tableLoading}
                            >
                                {columns?.configs?.module_title}
                            </Button>
                        </Link>
                    </Col>
                )}
            </Row>
            <Card loading={tableLoading}>
                <Table
                    columns={columns?.cols}
                    rowKey={(record) => record.id  || record._id}
                    dataSource={data?.data}
                    pagination={{
                        pageSize: pagination?.pageSize,
                        current: pagination?.current,
                        pageSizeOptions: ["15", "30", "50", "100", "500"],
                        total: data?.total,
                        showTotal: (total)=>(
                            <Button>Total: {data?.total}</Button>
                        ),

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
