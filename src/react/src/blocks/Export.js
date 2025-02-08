import { Button, Dropdown } from "antd";
import { CSVDownload, CSVLink } from "react-csv";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { FileExcelOutlined } from "@ant-design/icons";
import * as api from "../api";
import dayjs from "dayjs";

function Export({ data, loading, columns }) {
  const { pageModule } = useParams();
  const [allData, setAllData] = useState([]);
  const [lo, setLo] = useState(false);

  const exportCSV = () => {
    setLo(true);
    api
      .getRows(pageModule, {
        pageSize: 10000,
        current: 1,
        filters: null,
        search: null,
        sorter: null,
      })
      .then((response) => {
        setLo(false);
        setAllData(response.data);
      });
  };

  const getHeader = () => {
    let headers = columns
      .map(function (item) {
        if (item.fieldName) {
          return { label: item.field?.display, key: item.fieldName };
        }
      })
      .filter((notUndefined) => notUndefined !== undefined);
    return headers;
  };

  const getData = (d) => {
    console.log("🚀 ~ getData ~ d:", d);
    let newData = d;
    columns.forEach((element) => {
      if (typeof element.dataSet === "object") {
        if (Object.keys(element.dataSet).length > 0) {
          newData.map(function (item) {
            return (item[element.fieldName] =
              element.dataSet[item[element.fieldName]]);
          });
        }
      }
      if (element.type === "DatePicker") {
        newData.map(function (item) {
          return (item[element.fieldName] =
            item[element.fieldName] !== null
              ? dayjs(item[element.fieldName]).format("YYYY-MM-DD")
              : "-");
        });
      }
    });
    return newData;
  };

  const items = [
    {
      label: (
        <CSVLink
          loading={loading}
          filename={`${pageModule}_data.csv`}
          data={getData(data)}
          headers={getHeader()}
        >
          <div>Export this Table</div>
        </CSVLink>
      ),
      key: "1",
      icon: <FileExcelOutlined />,
    },
  ];

  return (
    <>
      {allData.length > 0 && (
        <CSVDownload
          data={getData(allData)}
          target="_blank"
          filename={`${pageModule}_all_data.csv`}
          headers={getHeader()}
        />
      )}
      <Dropdown.Button
        loading={lo}
        menu={{ items }}
        onClick={exportCSV}
        // icon={<DownOutlined />}
      >
        <FileExcelOutlined /> Export All Data
      </Dropdown.Button>
    </>
  );
}

export default Export;
