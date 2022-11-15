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
  removeLastNumberFromString,
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

    // this is next name Like Cliked elenent
    const nextNumberLikeCliked = findNextName(newData, newData[index].name);

    let children = [];
    if (newData[index].type === "Group") {
      newData[index].children.forEach((child) => {
        const ChildNameWithOutNumber = removeLastNumberFromString(child.name);
        children.push({
          ...child,
          name: ChildNameWithOutNumber + nextNumberLikeCliked,
          value: "",
        });
      });
    }

    const nameWithOutNumber = removeLastNumberFromString(newData[index].name);

    const newRow = {
      ...newData[index],
      children: children,
      name: nameWithOutNumber + nextNumberLikeCliked,
      value: "",
    };

    newData.splice(index + 1, 0, newRow);

    setFields(newData);
  };

  const removeField = (index) => {
    const newData = [...fields];

    if (getLastNumber(newData[index].name) === 1) {
      alert("can not remove first row!");
      return;
    }
    form.setFieldValue(newData[index].name, "");

    if (newData[index].type === "Group") {
      newData[index].children.forEach((child) => {
        form.setFieldValue(child.name, "");
      });
    }
    newData.splice(index, 1);

    // newData.splice(index+1, 0, newRow);
    setFields(newData);
  };

  return (
    <div className={`${pageModule}-${pageType}`}>
      <Breadcrumb>
        <Breadcrumb.Item className="capitalize">{pageModule}</Breadcrumb.Item>
        <Breadcrumb.Item className="capitalize">{pageType}</Breadcrumb.Item>
      </Breadcrumb>

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
