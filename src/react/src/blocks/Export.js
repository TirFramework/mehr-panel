import { Button, Dropdown } from "antd";
import { CSVDownload, CSVLink } from "react-csv";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { ExportOutlined, DownOutlined } from "@ant-design/icons";
import * as api from "../api";

function Export({ data, loading }) {
  const { pageModule } = useParams();
  const [allData, setAllData] = useState([]);
  const [lo, setLo] = useState(false);

  const exportCSV = () => {
    setLo(true);
    api.getRows(pageModule, { pageSize: 1000 }).then((response) => {
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
      icon: <ExportOutlined />,
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
        <ExportOutlined /> Export All Data
      </Dropdown.Button>
    </>
  );
}

export default Export;
