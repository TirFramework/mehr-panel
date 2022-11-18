import { useEffect, useState } from "react";
import { Redirect, useParams, Link } from "react-router-dom";
import {
  Form,
  Button,
  Breadcrumb,
  notification,
  Typography,
  Card,
  Space,
  Row,
  Col,
} from "antd";

import * as api from "../api";

import Field from "../components/Field";

import {
  decreaseNumberInString,
  findDuplicateName,
  findNextName,
  fixNumber,
  getLastNumber,
  increaseNumberInString,
  mapErrors,
  replaceLastNumberFromString,
  stringToObject,
} from "../lib/helpers";

import { useUrlParams } from "../hooks/useUrlParams";
import SubmitGroup from "../components/SubmitGroup";
import FormGroup from "../components/FormGroup";

const { Title } = Typography;

const Create = () => {
  const [form] = Form.useForm();

  const [urlParams, , setUrlParams] = useUrlParams();
  const pageId = urlParams.id;
  const editMode = urlParams.editMode;

  const { pageModule } = useParams();
  const { pageType } = useParams();
  // const { pageId } = useParams();

  const [fields, setFields] = useState([]);
  const [bootLoad, setBootLoad] = useState(true);
  const [submitLoad, setSubmitLoad] = useState(true);

  // const makeField = () => {};

  useEffect(() => {
    setBootLoad(true);

    setFields([]);
    api.getCreateOrEditFields(pageModule, pageId).then((res) => {
      setFields(res);
      setBootLoad(false);
      setSubmitLoad(false);
    });
  }, [pageModule, pageId]);

  const onFinish = (values) => {
    console.log("Success:", values);

    values = fixNumber(values);
    console.log("After ronded :", values);

    values = stringToObject(values);

    console.log("After fix :", values);

    setSubmitLoad(true);

    api
      .postEditOrCreate(pageModule, pageId, values)
      .then((res) => {
        setSubmitLoad(false);

        if (!pageId) {
          setUrlParams({ id: res.id });
        }
        notification["success"]({
          message: res.message,
        });
      })
      .catch((err) => {
        setSubmitLoad(false);

        let mes = [];
        for (const [key, value] of Object.entries(err.response.data.message)) {
          value.forEach((val) => {
            mes.push(val);
          });
        }

        notification["warning"]({
          message: "Error !",
          description: (
            <ul className="pl-2">
              {mes.map((val) => (
                <li>{val}</li>
              ))}
            </ul>
          ),
        });
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const duplicateGrope = (index) => {
    const newData = [...fields];
    let name;
    let isGrpup;
    let thisData;

    if (typeof index === "string") {
      name = name;
      isGrpup = newData[index].type === "Group";
      thisData = newData[index];
    } else {
      name = newData[index[0]].children[index[1]].name;
      isGrpup = newData[index[0]].children[index[1]].type === "Group";
      thisData = newData[index[0]].children;
    }

    const nextNumberLikeCliked = findNextName(thisData, name);

    let children = [];

    if (isGrpup) {
      newData[index].children.forEach((child) => {
        const ChildNameWithOutNumber = replaceLastNumberFromString(
          child.name,
          nextNumberLikeCliked
        );
        children.push({
          ...child,
          name: ChildNameWithOutNumber,
          // display: ChildNameWithOutNumber,
          value: "",
        });
      });
    }

    const nameWithOutNumber = replaceLastNumberFromString(name);

    let otherFilde = {};

    if (typeof index === "string") {
      otherFilde = newData[index[0]].children[index[1]];
    } else {
      otherFilde = newData[index[0]].children[index[1]];
    }

    const newRow = {
      ...otherFilde,
      children: children,
      name: nameWithOutNumber + nextNumberLikeCliked,
      // display: nameWithOutNumber + nextNumberLikeCliked,
      value: "",
    };

    if (typeof index === "string") {
      newData.splice(index + 1, 0, newRow);
    } else {
      newData[index[0]].children.splice(index[1] + 1, 0, newRow);
    }

    setFields(newData);
  };

  const removeField = (index) => {
    const newData = [...fields];

    let name;
    let isGrpup;

    if (typeof index === "string") {
      name = name;
      isGrpup = newData[index].type === "Group";
    } else {
      name = newData[index[0]].children[index[1]].name;
      isGrpup = newData[index[0]].children[index[1]].type === "Group";
    }

    if (getLastNumber(name) === 1) {
      alert("can not remove first row!");
      return;
    }
    form.setFieldValue(name, "");

    if (isGrpup) {
      newData[index].children.forEach((child) => {
        form.setFieldValue(child.name, "");
      });
    }

    if (typeof index === "string") {
      newData.splice(index, 1);
    } else {
      newData[index[0]].children.splice(index[1], 1);
    }

    // newData.splice(index+1, 0, newRow);
    setFields(newData);
  };

  return (
    <div className={`${pageModule}-${pageType}`}>
      <Breadcrumb>
        <Breadcrumb.Item className="capitalize">{pageModule}</Breadcrumb.Item>
        <Breadcrumb.Item className="capitalize">{pageType}</Breadcrumb.Item>
      </Breadcrumb>

      <Form
        form={form}
        name="basic"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Title className="capitalize">
              {pageType} {pageModule}
            </Title>
          </Col>
          <Col>
            <SubmitGroup form={form} loading={submitLoad} />
          </Col>
        </Row>
        <Card loading={bootLoad}>
          <Row gutter={[16, 16]}>
            {fields.map((field, index) => (
              <FormGroup
                key={index}
                index={index}
                pageType={pageType}
                loading={submitLoad}
                addrow={duplicateGrope}
                removeRow={removeField}
                {...field}
              />
            ))}
          </Row>
        </Card>

        <SubmitGroup form={form} loading={submitLoad} />
      </Form>
    </div>
  );
};

export default Create;
