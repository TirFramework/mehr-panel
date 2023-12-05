import { Button, Dropdown } from "antd";
import { CSVDownload, CSVLink } from "react-csv";
import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  ExportOutlined,
  DownOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import * as api from "../api";

function Export({ data, loading }) {
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

  const items = [
    {
      label: (
        <CSVLink
          loading={loading}
          filename={`${pageModule}_data.csv`}
          data={data}
        >
          <div>Export to CSV</div>
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
          data={allData}
          target="_blank"
          filename={`${pageModule}_all_data.csv`}
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
