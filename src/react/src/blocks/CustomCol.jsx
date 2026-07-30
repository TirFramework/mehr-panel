import React, { useState, useMemo, useEffect } from "react";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Input,
  Modal,
  Row,
  Switch,
} from "antd";
import { SettingOutlined, SearchOutlined } from "@ant-design/icons";
import useLocalStorage from "../hooks/useLocalStorage";
import { useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function toList(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return Object.values(value);
  return [];
}

function CustomCol({ column, onChange }) {
  const Options = useMemo(
    () => (column || []).map((item) => item.field.display).filter(Boolean),
    [column]
  );
  const { pageModule } = useParams();
  const { t } = useLanguage();

  const [columnList, setColumnList] = useLocalStorage(
    `cols-${pageModule}`,
    Options
  );

  const selectedList = toList(columnList);

  const [showAllSwitch, setShowAllSwitch] = useState(() => {
    const stored = window.localStorage.getItem(`cols-showAll-${pageModule}`);
    if (stored !== null) {
      try {
        return JSON.parse(stored);
      } catch {
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
    const stored = window.localStorage.getItem(`cols-showAll-${pageModule}`);
    if (stored !== null) {
      try {
        setShowAllSwitch(JSON.parse(stored));
      } catch {
        setShowAllSwitch(false);
      }
    } else {
      setShowAllSwitch(false);
    }
  }, [pageModule]);

  const saveShowAllSwitch = (value) => {
    setShowAllSwitch(value);
    window.localStorage.setItem(
      `cols-showAll-${pageModule}`,
      JSON.stringify(value)
    );
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchText) return Options;
    const q = searchText.toLowerCase();
    return Options.filter((option) => option?.toLowerCase().includes(q));
  }, [Options, searchText]);

  const effectiveColumnList = showAllSwitch ? Options : selectedList;

  const handleInvert = () => {
    const inverted = Options.filter((opt) => !selectedList.includes(opt));
    setColumnList(inverted);
  };

  const isPartial =
    !showAllSwitch &&
    selectedList.length > 0 &&
    selectedList.length < Options.length;

  const isAllSelected =
    showAllSwitch ||
    (Options.length > 0 && selectedList.length === Options.length);

  const closeModal = () => {
    setIsModalOpen(false);
    setSearchText("");
  };

  return (
    <>
      <Button
        type="primary"
        danger={!showAllSwitch && Options.length !== selectedList.length}
        size="large"
        onClick={() => setIsModalOpen(true)}
        icon={<SettingOutlined />}
        htmlType="button"
        title={t.CUSTOMIZE_COLUMNS}
      />

      <Modal
        className="custom-col-modal"
        open={isModalOpen}
        onCancel={closeModal}
        title={t.CUSTOMIZE_COLUMNS}
        closable
        footer={null}
        width={720}
        destroyOnHidden
      >
        <div className="custom-col-modal__body">
          <div className="custom-col-modal__toolbar">
            <span>{t.SHOW_ALL_COLUMNS}</span>
            <Switch checked={showAllSwitch} onChange={saveShowAllSwitch} />
          </div>

          <Divider style={{ margin: "12px 0" }} />

          <Input
            placeholder={t.SEARCH_COLUMNS}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            disabled={showAllSwitch}
          />

          <div className="custom-col-modal__select-row">
            <Checkbox
              indeterminate={isPartial}
              onChange={(e) => {
                if (!showAllSwitch) {
                  setColumnList(e.target.checked ? Options : []);
                }
              }}
              checked={isAllSelected}
              disabled={showAllSwitch}
            >
              {t.SELECT_ALL}
            </Checkbox>
            <Button
              size="small"
              onClick={handleInvert}
              disabled={showAllSwitch}
              htmlType="button"
            >
              {t.INVERT_SELECTION}
            </Button>
          </div>

          <Divider style={{ margin: "12px 0" }} />

          <Checkbox.Group
            className="custom-col-modal__group"
            value={effectiveColumnList}
            disabled={showAllSwitch}
            onChange={(list) => {
              if (showAllSwitch) return;
              // Keep checked items hidden by the current search filter
              const hiddenSelected = selectedList.filter(
                (item) => !filteredOptions.includes(item)
              );
              setColumnList([...hiddenSelected, ...list]);
            }}
          >
            <Row gutter={[16, 12]}>
              {filteredOptions.map((option) => (
                <Col key={option} xs={24} sm={12} md={8}>
                  <Checkbox value={option}>{option}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>

          {filteredOptions.length === 0 && (
            <div className="custom-col-modal__empty">{t.NO_RESULTS_FOUND}</div>
          )}

          <Divider style={{ margin: "16px 0 12px" }} />

          <div className="custom-col-modal__footer">
            <Button onClick={closeModal} htmlType="button">
              {t.CANCEL}
            </Button>
            <Button
              type="primary"
              htmlType="button"
              onClick={() => {
                const filteredList = (column || []).filter((item) =>
                  showAllSwitch
                    ? true
                    : selectedList.includes(item.field.display)
                );
                onChange(filteredList);
                closeModal();
              }}
            >
              {t.CONFIRM}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CustomCol;
