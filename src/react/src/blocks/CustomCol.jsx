import React, { useState, useMemo, useEffect } from "react";
import { Button, Checkbox, Col, Divider, Input, Modal, Row, Switch, Space } from "antd";
import { SettingOutlined, SearchOutlined } from "@ant-design/icons";
import useLocalStorage from "../hooks/useLocalStorage";
import { useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function CustomCol({ column, onChange }) {
  const Options = column?.map((item) => item.field.display);
  const { pageModule } = useParams();
  const { t } = useLanguage();

  const [columnList, setColumnList] = useLocalStorage(
    `cols-${pageModule}`,
    Options
  );

  // Handle showAllSwitch separately since useLocalStorage wraps in object
  const [showAllSwitch, setShowAllSwitch] = useState(() => {
    const stored = window.localStorage.getItem(`cols-showAll-${pageModule}`);
    if (stored !== null) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  // Sync showAllSwitch when pageModule changes
  useEffect(() => {
    const stored = window.localStorage.getItem(`cols-showAll-${pageModule}`);
    if (stored !== null) {
      try {
        setShowAllSwitch(JSON.parse(stored));
      } catch (e) {
        setShowAllSwitch(false);
      }
    } else {
      setShowAllSwitch(false);
    }
  }, [pageModule]);

  const saveShowAllSwitch = (value) => {
    setShowAllSwitch(value);
    window.localStorage.setItem(`cols-showAll-${pageModule}`, JSON.stringify(value));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Filter options based on search text
  const filteredOptions = useMemo(() => {
    if (!Options || !Array.isArray(Options)) return [];
    if (!searchText) return Options;
    return Options.filter((option) =>
      option?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [Options, searchText]);

  // Handle show all switch
  const handleShowAllChange = (checked) => {
    saveShowAllSwitch(checked);
    // When turning off, the previous columnList state is already saved
    // When turning on, we keep the current columnList state
  };

  // Get effective column list (all if showAllSwitch is on)
  const effectiveColumnList = showAllSwitch ? Options : Object.values(columnList);

  // Invert selection
  const handleInvert = () => {
    const currentSelected = Object.values(columnList);
    const inverted = Options.filter((opt) => !currentSelected.includes(opt));
    setColumnList(inverted);
  };

  return (
    <>
      <Button
        type="primary"
        danger={
          showAllSwitch
            ? false
            : Options?.length !== Object.values(columnList).length
        }
        size={"large"}
        onClick={() => {
          setIsModalOpen(true);
        }}
        icon={<SettingOutlined />}
      />

      {Options && (
        <Modal
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setSearchText("");
          }}
          title={t.CUSTOMIZE_COLUMNS}
          closable={true}
          footer={null}
          width={800}
          styles={{
            body: {
              padding: "24px",
            },
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {/* Show All Switch */}
            <Row align="middle" gutter={8}>
              <Col>
                <span>{t.SHOW_ALL_COLUMNS}</span>
              </Col>
              <Col>
                <Switch
                  checked={showAllSwitch}
                  onChange={handleShowAllChange}
                />
              </Col>
            </Row>

            <Divider />

            {/* Search Input */}
            <Input
              placeholder={t.SEARCH_COLUMNS}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />

            {/* Check all / Invert controls */}
            <Row justify="space-between" align="middle">
              <Col>
                <Checkbox
                  indeterminate={
                    !showAllSwitch &&
                    !!Object.values(columnList).length &&
                    Object.values(columnList).length < Options.length
                  }
                  onChange={(e) => {
                    if (!showAllSwitch) {
                      setColumnList(e.target.checked ? Options : []);
                    }
                  }}
                  checked={
                    showAllSwitch ||
                    Options.length === Object.values(columnList).length
                  }
                  disabled={showAllSwitch}
                >
                  {t.SELECT_ALL}
                </Checkbox>
              </Col>
              <Col>
                <Button
                  size="small"
                  onClick={handleInvert}
                  disabled={showAllSwitch}
                >
                  {t.INVERT_SELECTION}
                </Button>
              </Col>
            </Row>

            <Divider />

            {/* Checkbox Group in 3 columns */}
            <Checkbox.Group
              value={effectiveColumnList}
              onChange={(list) => {
                if (!showAllSwitch) {
                  // Merge: keep selections that are hidden by the current search
                  // filter, then apply the new selection for visible ones.
                  // Without this, onChange only receives checked values among
                  // visible options and wipes out any hidden checked items.
                  const hiddenSelected = Object.values(columnList).filter(
                    (item) => !filteredOptions.includes(item)
                  );
                  setColumnList([...hiddenSelected, ...list]);
                }
              }}
              disabled={showAllSwitch}
            >
              <Row gutter={[16, 16]}>
                {filteredOptions.map((option) => (
                  <Col span={8} key={option}>
                    <Checkbox value={option}>{option}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>

            {filteredOptions.length === 0 && (
              <div style={{ textAlign: "center", padding: "20px" }}>
                {t.NO_RESULTS_FOUND}
              </div>
            )}

            <Divider />

            {/* Action Buttons */}
            <Row justify="center" gutter={16}>
              <Col>
                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSearchText("");
                  }}
                >
                  {t.CANCEL}
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={() => {
                    const filteredList = column.filter((item) =>
                      showAllSwitch
                        ? true
                        : Object.values(columnList).includes(
                          item.field.display
                        )
                    );
                    onChange(filteredList);
                    setIsModalOpen(false);
                    setSearchText("");
                  }}
                >
                  {t.CONFIRM}
                </Button>
              </Col>
            </Row>
          </Space>
        </Modal>
      )}
    </>
  );
}

export default CustomCol;
