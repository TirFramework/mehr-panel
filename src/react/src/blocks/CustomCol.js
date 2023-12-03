import { Button, Checkbox, Divider, Modal } from "antd";
import { useState } from "react";
import { SettingOutlined } from "@ant-design/icons";
import useLocalStorage from "../hooks/useLocalStorage";
import { useParams } from "react-router-dom";

function CustomCol({ column, onChange }) {
  const Options = column?.map((item) => item.title);
  const { pageModule } = useParams();

  const [columnList, setColumnList] = useLocalStorage(
    `cols-${pageModule}`,
    Options
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        type="primary"
        danger={Options?.length !== Object.values(columnList).length}
        size={"large"}
        onClick={() => {
          setIsModalOpen(true);
        }}
        icon={<SettingOutlined />}
      />

      {Options && (
        <Modal
          title="Basic Modal"
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
          }}
          onOk={() => {
            const filteredList = column.filter((item) =>
              Object.values(columnList).includes(item.title)
            );
            onChange(filteredList);
            setIsModalOpen(false);
          }}
        >
          <>
            <Checkbox
              indeterminate={
                !!Object.values(columnList).length &&
                Object.values(columnList).length < Options.length
              }
              onChange={(e) => {
                setColumnList(e.target.checked ? Options : []);
              }}
              checked={Options.length === Object.values(columnList).length}
            >
              Check all
            </Checkbox>
            <Divider />
            <Checkbox.Group
              options={Options}
              value={Object.values(columnList)}
              onChange={(list) => {
                setColumnList(list);
              }}
            />
          </>
        </Modal>
      )}
    </>
  );
}

export default CustomCol;
