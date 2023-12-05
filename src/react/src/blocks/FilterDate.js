import { Button, Col, DatePicker, Divider, Input, Row, Slider } from "antd";
import dayjs from "dayjs";

function FilterDate({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  close,
  filters,
}) {
  return (
    <div style={{ padding: 8 }}>
      {/* <>
         <DatePicker.RangePicker
          // format={"DD-MM-YY"}
          size="small"
          value={
            selectedKeys.length > 0
              ? [dayjs(selectedKeys[0]), dayjs(selectedKeys[1])]
              : ""
          }
          onChange={(e) => {
            setSelectedKeys([
              //   e[0].format("YYYY-MM-DDT00:00:00Z"),
              e[0],
              e[1],
            ]);
          }}
          allowClear={false}
        />
      </> */}
      <div style={{ padding: "0 16px" }}>
        <Slider
          size={"small"}
          style={{ width: "200px" }}
          min={1}
          max={2000}
          range
          marks={{
            1: "1",
            2000: "2000",
          }}
          value={selectedKeys.length > 0 ? selectedKeys : [0, 2000]}
          onChange={(val) => {
            console.log("🚀 ~ file: FilterDate.js:40 ~ val:", val);
            setSelectedKeys(val);
          }}
        />
      </div>
      {/* <>
        <Input
          value={selectedKeys}
          placeholder="Search"
          size="small"
          onChange={(e) => {
            console.log("🚀 ~ file: FilterDate.js:40 ~ val:", e.target.value);
            setSelectedKeys(e.target.value);
          }}
        />
      </> */}
      <Divider style={{ margin: "8px" }} />
      <Row justify={"space-between"}>
        <Col>
          <Button
            type="link"
            size="small"
            onClick={() => {
              clearFilters();
            }}
          >
            Reset
          </Button>
        </Col>
        <Col>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              confirm();
              close();
            }}
          >
            Filter
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default FilterDate;
