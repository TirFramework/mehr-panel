import React from "react";
import { Button, Dropdown, message } from "antd";
import { CSVDownload, CSVLink } from "react-csv";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { FileExcelOutlined, CopyOutlined } from "@ant-design/icons";
import * as api from "../api";
import dayjs from "dayjs";
import { objectToQueryString } from "../lib/utils";
import { useLanguage } from "../context/LanguageContext";

function Export({ data, loading, columns, pagination }) {
  const orgData = [...(Array.isArray(data) ? data : [])];
  const { t } = useLanguage();
  const orgColumns = [...(Array.isArray(columns) ? columns : [])];
  const { pageModule } = useParams();
  const [allData, setAllData] = useState([]);
  const [lo, setLo] = useState(false);
  const [exportAllTrigger, setExportAllTrigger] = useState(false);

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
        setExportAllTrigger(true); // Trigger download after data is received
      });
  };

  const handleShare = async () => {
    const url = `${window.location.href}?${objectToQueryString(pagination, columns)}`;

    // First check whether the browser supports the Web Share API.
    if (navigator.share) {
      try {
        await navigator.share({
          url,
        });
      } catch (error) {}
      return;
    }

    // Fallback: Clipboard API (requires secure context) or execCommand
    try {
      if (navigator.clipboard != null && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      message.success(t.LINK_COPIED);
    } catch (error) {
      message.error(t.LINK_COPY_FAILED);
    }
  };
  const getHeader = () => {
    return orgColumns
      .filter((item) => item.fieldName)
      .map((item) => ({ label: item.field?.display, key: item.fieldName }));
  };

  const getData = (d) => {
    // Create a deep copy of the data to avoid mutating the original
    const newData = d.map((item) => ({ ...item }));

    orgColumns.forEach((element) => {
      if (typeof element.dataSet === "object" && element.dataSet !== null) {
        if (Object.keys(element.dataSet).length > 0) {
          newData.forEach((item) => {
            item[element.fieldName] = element.dataSet[item[element.fieldName]];
          });
        }
      }
      if (element.type === "DatePicker") {
        newData.forEach((item) => {
          item[element.fieldName] =
            item[element.fieldName] !== null
              ? dayjs(item[element.fieldName]).format("YYYY-MM-DD")
              : "-";
        });
      }
    });
    return newData;
  };

  const items = [
    {
      label: (
        <CSVLink
          filename={`${pageModule}_data.csv`}
          data={getData(orgData)}
          headers={getHeader()}
        >
          <div>{t.EXPORT_THIS_TABLE}</div>
        </CSVLink>
      ),
      key: "1",
      icon: <FileExcelOutlined />,
    },
    {
      label: <div onClick={exportCSV}>{t.EXPORT_ALL_DATA}</div>,
      key: "2",
      icon: <FileExcelOutlined />,
      disabled: lo,
    },
    {
      label: <> {t.SHARE_THIS_TABLE}</>,
      key: "3",
      icon: <CopyOutlined />,
      onClick: () => {
        handleShare();
      },
    },
  ];

  return (
    <>
      {exportAllTrigger && allData.length > 0 && (
        <CSVDownload
          data={getData(allData)}
          target="_blank"
          filename={`${pageModule}_all_data.csv`}
          headers={getHeader()}
          onDownload={() => setExportAllTrigger(false)}
        />
      )}
      <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
        <Button icon={<FileExcelOutlined />} />
      </Dropdown>
    </>
  );
}

export default Export;
