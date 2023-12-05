import {
  Button,
  Popover,
  Tag,
  Form,
  DatePicker,
  Space,
  Divider,
  Col,
  Row,
} from "antd";
import dayjs from "dayjs";
import {
  EditOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
  CloseOutlined,
  FormOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import {
  useParams,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useDeleteRow } from "../Request";
import useLocalStorage from "../hooks/useLocalStorage";
import { useQueryClient } from "react-query";
import Config from "../constants/config";
import Field from "../components/Field";
import { defaultFIlter } from "../constants/config";
import FilterDate from "../blocks/FilterDate";

export const getColsNormalize = (res, params, pageModule) => {
  let cols = res.cols;

  //   // loop for detect array
  cols.forEach((col, index) => {
    // ----------------------------------------
    // convert to array
    col.dataIndex = col.dataIndex.split(".");
    // ----------------------------------------
    // -----------------------------------
    // add data for filter
    // col.sorter = true;

    // col.filterDropdown = (props) => {
    //   return <FilterDate {...props} />;
    // };

    // col.filterIcon = (filtered) => (
    //   <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    // );

    // -----------------------------------
    // -----------------------------------
    // add data for filter
    if (col.filters !== undefined) {
      col.filters?.map((item) => (item.text = item.label));
      col.filterSearch = col.filters.length > 10;
    }
    // -----------------------------------
    // -----------------------------------
    // add data for filter
    if (col.filters !== undefined) {
      col.filters?.map((item) => (item.text = item.label));
      col.filterSearch = col.filters.length > 10;
    }
    // -----------------------------------

    col.render = (value, data, rowIndex) => {
      return (
        <Render
          value={value}
          item={col}
          data={data}
          rowIndex={rowIndex}
          id={data[Config.interactionCharacter]}
        />
      );
    };

    if (col.comment?.content !== undefined) {
      col.title = (
        <div>
          {col.title}
          <Popover content={col.comment.content} title={col.comment.title}>
            <QuestionCircleOutlined />
          </Popover>
        </div>
      );
    }
    // col.sorter = col.field.sortable;
    // if (activeColumn.length > 0) {
    //   if (!activeColumn.includes(col.fieldName)) {
    //     col.className = "hidden";
    //   }
    // }
  });
  cols.push(actions(res.configs.actions, pageModule));
  return res;
};

const actions = (moduleActions, pageModule) => {
  const showAction = moduleActions.show;
  const editAction = moduleActions.edit;
  const deleteAction = moduleActions.destroy;
  return {
    title: "Actions",
    dataIndex: Config.interactionCharacter,
    align: "center",
    fixed: "right",
    width: 160,
    render: (id) => {
      return (
        <>
          <div className="action-td">
            {showAction && <DetailRow id={id} />}

            {editAction && <InlineEdit id={id} />}

            {editAction && <EditRow id={id} />}

            {deleteAction && <DeleteRow id={id} />}
          </div>
        </>
      );
    },
  };
};

const DetailRow = ({ id }) => {
  const { pageModule } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  let pageId = searchParams.get("id");

  return (
    <>
      {pageId == id ? (
        <></>
      ) : (
        <Button
          type="link"
          disabled={!!pageId}
          onClick={() => {
            navigate(`/admin/${pageModule}/detail?id=${id}`);
          }}
          icon={<EyeOutlined />}
        />
      )}
    </>
  );
};
const EditRow = ({ id }) => {
  const { pageModule } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  let pageId = searchParams.get("id");

  return (
    <>
      {pageId == id ? (
        <></>
      ) : (
        <Button
          type="link"
          onClick={() => {
            navigate(`/admin/${pageModule}/create-edit?id=${id}`);
          }}
          icon={<FormOutlined />}
        />
      )}
    </>
  );
};
const DeleteRow = ({ id }) => {
  const { pageModule } = useParams();
  useDeleteRow(pageModule, id);

  const [searchParams] = useSearchParams();
  let pageId = searchParams.get("id");

  const deleteRow = useDeleteRow();

  const [pagination, setPagination] = useLocalStorage(pageModule, {
    ...defaultFIlter,
    key: pageModule,
  });
  const queryClient = useQueryClient();

  return (
    <>
      {pageId == id ? (
        <></>
      ) : (
        <Button
          type="link"
          danger
          loading={deleteRow.isLoading}
          onClick={() => {
            deleteRow.mutate(
              { pageModule, id },
              {
                onSuccess: () => {
                  queryClient.setQueryData(
                    [`index-data-${pageModule}`, pagination],
                    (oldData) => {
                      const basic = { ...oldData };
                      const newData = oldData.data.filter(
                        (item) => item[Config.interactionCharacter] !== id
                      );
                      basic.total = oldData.total - 1;
                      return { ...basic, data: newData };
                    }
                  );
                },
              }
            );
          }}
          icon={<DeleteOutlined />}
        />
      )}
    </>
  );
};

const InlineEdit = ({ id }) => {
  const [urlParams, setUrlParams] = useSearchParams();
  let pageId = urlParams.get("id");

  return (
    <>
      {pageId == id ? (
        <Button
          type="link"
          htmlType="submit"
          onClick={() => {
            setUrlParams(``);
          }}
          // icon={<CloseOutlined />}
        >
          Cancel
        </Button>
      ) : (
        <>
          <Button
            onClick={() => {
              setUrlParams(`id=${id}`);
            }}
            type="link"
            icon={<EditOutlined />}
          />
        </>
      )}
    </>
  );
};

export const indexOfInObject = (arr, obj, val, label) => {
  let result = -1;
  arr.forEach((element, index) => {
    if (element[obj] === val) {
      result = index;
    }
  });

  if (label) {
    if (result !== -1) {
      return arr[result][label];
    } else {
      return "";
    }
  } else {
    return result;
  }
};

const Render = ({ item, value, rowIndex, data, id }) => {
  const [searchParams] = useSearchParams();
  let pageId = searchParams.get("id");

  if (id == pageId && pageId && id) {
    return <Field value={value} {...item.field} />;
  } else {
    if (item.type === "DatePicker") {
      return dayjs(value).format(
        !item.field.options?.showTime?.length
          ? item.field.options.dateFormat
          : item.field.options.dateFormat + " " + item.field.options?.showTime
      );
    } else if (item.dataSet.length !== 0) {
      if (typeof value === "object" && value) {
        return (
          <>
            {value.map((val, index) => (
              <Tag key={index}>{item.dataSet[val.id]}</Tag>
            ))}
          </>
        );
      } else {
        return <>{item.dataSet[value]}</>;
      }
    } else if (item.valueType === "array") {
      return (
        <>
          {value?.map((value, index) => (
            <Tag key={index}>
              <Render value={value} item={item} />
            </Tag>
          ))}
        </>
      );
    } else {
      return <div>{value}</div>;
    }
  }
};
