import { Button, Dropdown } from "antd";
import { CSVDownload, CSVLink } from "react-csv";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { FileExcelOutlined, CopyOutlined } from "@ant-design/icons";
import * as api from "../api";
import dayjs from "dayjs";
import {
  extractFromlocalhost,
  extractQueryParams,
  objectToQueryString,
} from "../lib/utils";

function Export({ data, loading, columns, pagination }) {
  const orgData = [...data];
  const orgColumns = [...columns];
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
        setExportAllTrigger(true); // فعال کردن دانلود بعد از دریافت داده‌ها
      });
  };

  const handleShare = async () => {
    // ابتدا بررسی می‌کنیم که آیا Web Share API در مرورگر پشتیبانی می‌شود یا خیر.
    if (navigator.share) {
      try {
        // اگر پشتیبانی می‌شود، از متد share استفاده می‌کنیم.
        await navigator.share({
          title: "title", // عنوان متنی که به اشتراک گذاشته می‌شود.
          text: "text", // متن اصلی پیام.
          url: objectToQueryString(pagination), // آدرسی که به اشتراک گذاشته می‌شود.
        });
        console.log("اشتراک‌گذاری موفقیت‌آمیز بود.");
      } catch (error) {
        console.error("خطا در هنگام اشتراک‌گذاری:", error);
      }
    } else {
      // در صورت عدم پشتیبانی مرورگر، یک پیام خطا در کنسول نمایش می‌دهیم.
      navigator.clipboard.writeText(
        `${window.location.href}?${objectToQueryString(pagination)}`
      );

      // alert("Web Share API در این مرورگر پشتیبانی نمی‌شود.");
    }
  };
  const getHeader = () => {
    return orgColumns
      .filter((item) => item.fieldName)
      .map((item) => ({ label: item.field?.display, key: item.fieldName }));
  };

  const getData = (d) => {
    // ایجاد یک کپی عمیق از داده‌ها برای جلوگیری از تغییر داده‌های اصلی
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
          loading={loading}
          filename={`${pageModule}_data.csv`}
          data={getData(orgData)}
          headers={getHeader()}
        >
          <div>Export this Table</div>
        </CSVLink>
      ),
      key: "1",
      icon: <FileExcelOutlined />,
    },
    {
      label: <> Share this table</>,
      key: "2",
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
      <Dropdown.Button loading={lo} menu={{ items }} onClick={exportCSV}>
        <FileExcelOutlined /> Export All Data
      </Dropdown.Button>
    </>
  );
}

export default Export;
