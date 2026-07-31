import React, { useState, useEffect } from "react";
import { Select, Tag } from "antd";
import { Link } from "react-router-dom";

import { separationRules } from "../lib/helpers";
import { LabeledFormItem, resolveReadonlyLabel, fieldCommentTooltip } from "../lib/fieldLabel";
import Readonly from "../blocks/Readonly";
import InputAddonWrapper, { extractAddonOptions } from "./InputAddon";
import Config from "../constants/config";

const findOptionColor = (data, value) => {
  if (!Array.isArray(data) || value === undefined || value === null) {
    return undefined;
  }
  const opt = data.find((o) => String(o.value) === String(value));
  return opt?.color;
};

const OptionLabel = ({ label, color }) => {
  if (!color) return label;
  return (
    <span className="mp-select-option" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span
        className="mp-select-option__swatch"
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: color,
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
};

const MySelect = (props) => {
  const { addonBefore, addonAfter, inputOptions } = extractAddonOptions(
    props.options
  );

  const sortedOptions = [...(props.data || [])].sort((a, b) =>
    String(a.label ?? "").localeCompare(String(b.label ?? ""))
  );

  return (
    <InputAddonWrapper addonBefore={addonBefore} addonAfter={addonAfter}>
      <Select
        {...inputOptions}
        data-cy={props.testId}
        showSearch
        filterOption={(input, option) =>
          String(option?.label ?? "")
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        }
        mode={props.multiple ? "multiple" : false}
        options={sortedOptions}
        optionRender={(option) => (
          <OptionLabel label={option.label} color={option.data?.color} />
        )}
        labelRender={({ label, value }) => (
          <OptionLabel label={label} color={findOptionColor(props.data, value)} />
        )}
        tagRender={({ label, value, closable, onClose }) => {
          const color = findOptionColor(props.data, value);
          return (
            <Tag
              color={color}
              closable={closable}
              onClose={onClose}
              style={{ marginInlineEnd: 4 }}
            >
              {label}
            </Tag>
          );
        }}
        disabled={props.disable}
        allowClear={!props.readonly && true}
        value={props.value}
        style={{ width: "100%", ...inputOptions.style }}
        onChange={(val) => {
          if (val !== undefined) {
            props.onChange(val);
          }
        }}
        onClear={() => {
          props.onChange(null);
        }}
      />
    </InputAddonWrapper>
  );
};

const SelcetIndex = ({ defaultValue, ...props }) => {
  const [value, setValue] = useState(props.value || defaultValue);
  useEffect(() => {
    setValue(props.value || defaultValue);
  }, [props.value, defaultValue]);

  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  // Extract value from relation object using the defined display field
  // Handles both MongoDB objects and simple IDs/strings/booleans from MySQL
  const extractRelationValue = (val) => {
    if (typeof val === "object" && val !== null) {
      const displayField = props.relation?.field;
      if (displayField && val[displayField] !== undefined) {
        return val[displayField];
      }
      return Object.values(val).find((v) => v !== null);
    }

    return val;
  };

  const getReadonlyLabel = (val) => {
    const displayValue = extractRelationValue(val);
    return props.dataSet?.[displayValue] || displayValue;
  };

  const renderReadonlyTag = (val, key) => {
    const optionValue = extractRelationValue(val);
    const label = getReadonlyLabel(val);
    const color = findOptionColor(props.data, optionValue);
    const linkTemplate = props.options?.linkTemplate;

    if (!linkTemplate || optionValue === undefined || optionValue === null) {
      return (
        <Tag key={key} color={color}>
          {label}
        </Tag>
      );
    }

    const to = `/${Config.prefix}/${linkTemplate}/detail?id=${optionValue}`;

    return (
      <Link key={key} to={to}>
        <Tag color={color}>{label}</Tag>
      </Link>
    );
  };

  if (props.readonly) {
    const { label, inline } = resolveReadonlyLabel({
      display: props.display,
      hideLabel: props.hideLabel,
      inlineLabel: props.inlineLabel,
      options: props.options,
    });

    if (props.value) {
      if (typeof props.value === "object" && Array.isArray(props.value)) {
        return (
          <Readonly
            data-cy={props.testId}
            label={label}
            inline={inline}
            options={props.options}
            comment={props.comment}
          >
            <div>
              {props.value.map((i, index) =>
                renderReadonlyTag(i, extractRelationValue(i) ?? index)
              )}
            </div>
          </Readonly>
        );
      }

      return (
        <Readonly
          data-cy={props.testId}
          label={label}
          inline={inline}
          options={props.options}
          comment={props.comment}
        >
          <div>{renderReadonlyTag(props.value, "single")}</div>
        </Readonly>
      );
    }

    return (
      <Readonly
        data-cy={props.testId}
        label={label}
        inline={inline}
        options={props.options}
        comment={props.comment}
      >
        {null}
      </Readonly>
    );
  }

  return (
    <>
      <LabeledFormItem
        name={props.name}
        display={props.display}
        hideLabel={props.hideLabel}
        inlineLabel={props.inlineLabel}
        options={props.options}
        tooltip={fieldCommentTooltip(props.comment)}
        initialValue={value}
        rules={rules}
      >
        <MySelect
          {...props}
          value={value}
          onChange={(val) => {
            setValue(val);
          }}
        />
      </LabeledFormItem>
    </>
  );
};

export default SelcetIndex;
