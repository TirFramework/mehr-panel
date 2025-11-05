import { Button, Col, DatePicker, Divider, Input, Row, Slider } from "antd";
import dayjs from "dayjs";

function FilterDate({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  close,
  filters,
  filtersType,
  data,
}) {
  const getMarks = (d) => {
    const transformedObject = {};

    for (const item of d) {
      transformedObject[Number(item.value)] = item.label;
    }

    return transformedObject;
  };

  const getMin = (d) => {
    return d[0].value;
  };

  const getMax = (d) => {
    return d[d.length - 1].value;
  };

  return (
    <div className="custom-filter">
      <>
        {filtersType === "DatePicker" && (
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
        )}
      </>

      {filtersType === "Slider" && (
        <div style={{ padding: "0 16px" }}>
          <Slider
            size={"small"}
            style={{ width: "200px" }}
            min={getMin(data)}
            max={getMax(data)}
            range
            marks={getMarks(data)}
            value={
              selectedKeys.length > 0
                ? selectedKeys
                : [getMin(data), getMax(data)]
            }
            onChange={(val) => {
              setSelectedKeys(val);
            }}
          />
        </div>
      )}
      {filtersType === "Search" && (
        <>
          <Input
            value={selectedKeys}
            placeholder="Search"
            size="small"
            onChange={(e) => {
              setSelectedKeys(e.target.value);
            }}
          />
        </>
      )}
      <div>
        <Divider style={{ margin: "8px" }} />
      </div>
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
