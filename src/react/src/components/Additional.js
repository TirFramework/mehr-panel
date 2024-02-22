import { useEffect, useState } from "react";
import { Button, Col, Row, Form } from "antd";
import Field from "./Field";
import { PlusOutlined, DragOutlined, CloseOutlined } from "@ant-design/icons";
import { findNextName, replaceLastNumberFromString } from "../lib/helpers";
import FormGroup from "./FormGroup";

const Additional = (props) => {
    const [fields, setFields] = useState(props.children);

    //   useEffect(() => {
    //     setFields(props.children);
    //   }, [props]);

    const removeRow = (index) => {
        const newData = [...fields];
        newData.splice(index, 1);
        setFields(newData);
    };

    const duplicate = () => {
        const data = [...fields];

        const templateFilde = [...props.template];

        const newRow = changeName(templateFilde);

        data.push(newRow);

        setFields(data);
    };

    const changeName = (arry) => {
        const newData = [...arry];
        newData.forEach((item, index) => {
            if (item.children) {
                newData[index] = {
                    ...item,
                    children: changeName(item.children),
                };
            } else {
                newData[index] = {
                    ...item,
                    name: replaceLastNumberFromString(item.name, new Date().getTime()),
                    // display: replaceLastNumberFromString(item.display, index),
                    value: null,
                };
                delete newData[index].value;
            }
        });
        return newData;
    };
    return (
        <>
            <div className={ props.readonly && "readOnly " + props.className} >
                {fields.length > 0 ? (
                    <>
                        {fields.map((child, index) => (
                            <Row
                                gutter={[16, 16]}
                                className="relative"
                                key={`additional-group-${index}`}
                            >
                                <Button
                                    icon={<CloseOutlined />}
                                    type="text"
                                    className="remove-btn"
                                    disabled={props.loading}
                                    onClick={() => {
                                        removeRow(index);
                                    }}
                                    danger
                                />
                                {child.map((f, i) => (
                                    <FormGroup key={`additional-field-${i}`} {...f} form={props.form}/>
                                ))}
                            </Row>
                        ))}
                    </>
                ) : (
                    <Form.Item name={props.name} initialValue={[]} />
                )}
            </div>

            <Button
                // shape="circle"
                className="w-full add-new-row-btn"
                disabled={props.loading}
                icon={!props.display && <PlusOutlined />}
                onClick={() => {
                    duplicate();
                }}
            >
                {props.display}
            </Button>
        </>
    );
};

export default Additional;
