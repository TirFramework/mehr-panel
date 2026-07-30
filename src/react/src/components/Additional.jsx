import React, { useEffect, useState } from "react";
import { Button, Row, Form } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { replaceLastNumberFromString } from "../lib/helpers";
import { resolveFieldClassName } from "../lib/fieldLabel";
import FormGroup from "./FormGroup";

const Additional = (props) => {
    const [fields, setFields] = useState(props.children);

    useEffect(() => {
        setFields(props.children);
    }, [props.children]);

    const removeRow = (index) => {
        const newData = [...fields];
        newData.splice(index, 1);
        setFields(newData);

        // If all rows are deleted, set empty array
        if (newData.length === 0) {
            props.form.setFieldValue(props.name, []);
        }
    };

    const duplicate = () => {
        const data = [...fields];

        const templateFilde = [...props.template];

        const newRow = changeName(templateFilde);

        data.push(newRow);

        setFields(data);
    };

    const changeName = (arry, timestamp) => {
        if (!timestamp) timestamp = new Date().getTime();

        const newData = [...arry];
        newData.forEach((item, index) => {
            // Replace both * and numbers in the name
            let newName = item.name;
            if (newName.includes('*')) {
                newName = newName.replace(/\*/g, timestamp);
            } else {
                newName = replaceLastNumberFromString(newName, timestamp);
            }

            if (item.children && item.children.length > 0) {
                // Recursively process children with the same timestamp
                const updatedChildren = changeName(item.children, timestamp);
                newData[index] = {
                    ...item,
                    children: updatedChildren,
                    name: newName,
                };
            } else {
                newData[index] = {
                    ...item,
                    name: newName,
                    value: null,
                };
                delete newData[index].value;
            }
        });
        return newData;
    };
    return (
        <div data-cy={props.testId || `Field-Additional-${props.name.replace(/\./g, '-')}`}>
            <div
              className={
                [
                  props.readonly ? "readOnly" : null,
                  resolveFieldClassName({
                    className: props.className,
                    class: props.class,
                    options: props.options,
                  }),
                ]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
            >
                {fields && fields.length > 0 ? (
                    <>
                        {fields.map((child, index) => (
                            <Row
                                gutter={[16, 16]}
                                className={`relative ${props.options.noBorder ? 'no-border' : 'border'}`}
                                key={`additional-group-${index}`}
                            >
                                {!props.readonly && (
                                    <Button
                                        icon={<CloseOutlined />}
                                        className="remove-btn"
                                        disabled={props.loading}
                                        onClick={() => {
                                            removeRow(index);
                                        }}
                                        danger
                                    />
                                )}
                                {child.map((f, i) => (
                                    <FormGroup
                                        key={`additional-field-${i}`}
                                        {...f}
                                        form={props.form}
                                        readonly={props.readonly}
                                        loading={props.loading}
                                        pageType={props.pageType}
                                    />
                                ))}
                            </Row>
                        ))}
                    </>
                ) : (
                    <Form.Item name={props.name} initialValue={[]} />
                )}
            </div>

            {!props.readonly && (
                <Button
                    className="w-full add-new-row-btn"
                    size="small"
                    color="danger"
                    disabled={props.loading}
                    icon={!props.display && <PlusOutlined />}
                    onClick={() => {
                        duplicate();
                    }}
                >
                    {props.display}
                </Button>
            )}
        </div>
    );
};

export default Additional;
