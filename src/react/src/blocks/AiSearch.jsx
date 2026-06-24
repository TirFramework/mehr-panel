import React, { useState, useEffect } from "react";
import { Input, Button, Space, Tooltip } from "antd";
import { RobotOutlined, LoadingOutlined, ThunderboltOutlined, SendOutlined } from "@ant-design/icons";
import useAiSearch from "../hooks/useAiSearch";
import { useLanguage } from "../context/LanguageContext";

const AI_COLOR = "#722ed1"; // purple — distinct from the primary blue

function AiSearch({ module, onFilters, onClear, onModeChange, activeFilters = {}, initialQuery = "", initialOpen = false }) {
  const { t } = useLanguage();
  const [aiMode, setAiMode] = useState(initialOpen);
  const [query, setQuery]   = useState(initialQuery);
  const { extractFilters, loading } = useAiSearch(module);

  // Sync query state when initialQuery changes from outside (e.g., Clear Filters button)
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const hasFilters = Object.keys(activeFilters).length > 0;

  const handleSubmit = async () => {
    if (!query.trim()) return;
    const filters = await extractFilters(query);
    onFilters(filters, query);
  };

  const handleToggle = () => {
    const next = !aiMode;
    setAiMode(next);
    if (onModeChange) onModeChange(next);
    // intentionally do NOT call onClear — filters stay active until the user
    // clears them manually via the wipe button
  };

  return (
    <Space size={4} align="center">
      <Tooltip title={aiMode ? "Disable AI search" : "AI natural language search"}>
        <Button
          size="large"
          icon={<RobotOutlined />}
          onClick={handleToggle}
          style={{
            background:  aiMode || hasFilters ? AI_COLOR : undefined,
            borderColor: aiMode || hasFilters ? AI_COLOR : undefined,
            color:       aiMode || hasFilters ? "#fff"   : undefined,
          }}
        />
      </Tooltip>

      {aiMode && (
        <Space direction="vertical" size={0}>
          <Space.Compact size="large" className="search-input" style={{ borderRadius: 8, boxShadow: `0 0 0 2px ${AI_COLOR}33` }}>
            <Input
              prefix={<ThunderboltOutlined style={{ color: AI_COLOR }} />}
              suffix={
                loading
                  ? <LoadingOutlined style={{ color: AI_COLOR }} />
                  : <SendOutlined
                      style={{ color: query.trim() ? AI_COLOR : "#bbb", cursor: query.trim() ? "pointer" : "default" }}
                      onClick={handleSubmit}
                    />
              }
              placeholder={t.AI_SEARCH_PLACEHOLDER}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onPressEnter={handleSubmit}
              disabled={loading}
              allowClear
              size="large"
              style={{ borderColor: AI_COLOR }}
            />
          </Space.Compact>
        </Space>
      )}
    </Space>
  );
}

export default AiSearch;

