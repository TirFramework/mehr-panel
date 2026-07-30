import React, { useEffect, useState } from "react";
import { Form, Input, Button, Space } from "antd";
import { EditOutlined, LockOutlined } from "@ant-design/icons";

import { separationRules } from "../lib/helpers";
import { LabeledFormItem, resolveReadonlyLabel, fieldCommentTooltip } from "../lib/fieldLabel";
import Readonly from "../blocks/Readonly";
import InputAddonWrapper, { extractAddonOptions } from "./InputAddon";

/** Lowercase English letters, digits, and hyphens only. */
const toSlug = (value) => {
  if (value == null || value === "") {
    return value;
  }

  return String(value)
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const SlugInput = ({ value, onChange, ...rest }) => (
  <Input
    {...rest}
    value={value}
    onChange={(e) => onChange?.(toSlug(e.target.value))}
  />
);

const FromSlugControl = ({
  synced,
  onUnlock,
  onLock,
  addonBefore,
  addonAfter,
  disabled,
  ...inputProps
}) => (
  <Space.Compact block style={{ width: "100%" }}>
    <InputAddonWrapper addonBefore={addonBefore} addonAfter={addonAfter}>
      <SlugInput {...inputProps} disabled={disabled} />
    </InputAddonWrapper>
    {synced ? (
      <Button
        type="default"
        icon={<EditOutlined />}
        onClick={onUnlock}
        aria-label="Edit slug"
      />
    ) : (
      <Button
        type="default"
        icon={<LockOutlined />}
        onClick={onLock}
        aria-label="Lock slug to source field"
      />
    )}
  </Space.Compact>
);

const slugOptions = (options) => {
  if (!options) return {};
  if (typeof options === "string") {
    try {
      const parsed = JSON.parse(options);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? parsed
        : {};
    } catch {
      return {};
    }
  }
  if (typeof options === "object" && !Array.isArray(options)) {
    return options;
  }
  return {};
};

const Slug = (props) => {
  const form = Form.useFormInstance();
  const opts = slugOptions(props.options);
  // `from` only applies while the field is editable
  const fromField = props.readonly ? undefined : opts.from || undefined;

  const sourceValue = Form.useWatch(fromField, form);
  const [synced, setSynced] = useState(Boolean(fromField));

  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  useEffect(() => {
    if (!fromField || !synced || props.readonly) {
      return;
    }

    const next = toSlug(sourceValue ?? "");
    if (form.getFieldValue(props.name) !== next) {
      form.setFieldValue(props.name, next);
    }
  }, [sourceValue, fromField, synced, props.readonly, form, props.name]);

  const unlock = () => {
    setSynced(false);
  };

  const lock = () => {
    const next = toSlug(form.getFieldValue(fromField) ?? "");
    form.setFieldValue(props.name, next);
    setSynced(true);
  };

  const { addonBefore, addonAfter, inputOptions } = extractAddonOptions(
    props.options
  );

  if (props.readonly) {
    const { label, inline } = resolveReadonlyLabel({
      display: props.display,
      hideLabel: props.hideLabel,
      inlineLabel: props.inlineLabel,
      options: props.options,
    });

    return (
      <Readonly
        data-cy={props.testId}
        label={label}
        inline={inline}
        options={props.options}
        comment={props.comment}
      >
        {props.value}
      </Readonly>
    );
  }

  const fieldDisabled =
    Boolean(props.disabled || props.disable) || (Boolean(fromField) && synced);

  return (
    <LabeledFormItem
      display={props.display}
      hideLabel={props.hideLabel}
      inlineLabel={props.inlineLabel}
      options={props.options}
      tooltip={fieldCommentTooltip(props.comment)}
      name={props.name}
      rules={rules}
      initialValue={toSlug(props.value)}
      normalize={toSlug}
    >
      {fromField ? (
        <FromSlugControl
          synced={synced}
          onUnlock={unlock}
          onLock={lock}
          addonBefore={addonBefore}
          addonAfter={addonAfter}
          placeholder={inputOptions.placeholder}
          disabled={fieldDisabled}
          {...inputOptions}
        />
      ) : (
        <InputAddonWrapper addonBefore={addonBefore} addonAfter={addonAfter}>
          <SlugInput
            placeholder={inputOptions.placeholder}
            disabled={fieldDisabled}
            {...inputOptions}
          />
        </InputAddonWrapper>
      )}
    </LabeledFormItem>
  );
};

export default Slug;
