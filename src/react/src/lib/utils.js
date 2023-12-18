import { Popover, Tag } from "antd";
import dayjs from "dayjs";
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";

import { useSearchParams } from "react-router-dom";
import Config from "../constants/config";
import Field from "../components/Field";
import FilterDate from "../blocks/FilterDate";
export const getColsNormalize = (res) => {
  let cols = res.cols;

  //   // loop for detect array
  cols.forEach((col) => {
    // ----------------------------------------
    // convert to array
    col.dataIndex = col.dataIndex.split(".");
    // ----------------------------------------
    // -----------------------------------
    // add data for filter
    // col.sorter = true;

    // -----------------------------------
    // -----------------------------------
    // add data for filter
    if (col.filters !== undefined) {
      col.filterDropdown = (props) => {
        return (
          <FilterDate {...props} filtersType={"slider"} data={col.filters} />
        );
      };

      if (col.filtersType === "input") {
        col.filterIcon = (filtered) => (
          <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
        );
      }

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
  // cols.push(actions(res.configs.actions, pageModule));
  return res;
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
