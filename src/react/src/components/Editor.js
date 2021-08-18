import React, { useMemo, useState } from "react";
import { Form } from "antd";
import reactDom from "react-dom";

import ReactQuill, { Quill } from "react-quill";
import { htmlEditButton } from "quill-html-edit-button";

import "react-quill/dist/quill.snow.css";

import { separationRules } from "../lib/helpers";

Quill.register("modules/htmlEditButton", htmlEditButton);

var quillObj;

const MyComponent = (props) => {
console.log("🚀 ~ file: editor.js ~ line 17 ~ MyComponent ~ props", props)


  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });
  

  const imageHandler = () => {
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      var file = input.files[0];
      var formData = new FormData();

      formData.append("image", file);

      var fileName = file.name;

      uploadFiles(file, fileName, quillObj);
    };
  };

  const uploadFiles = (uploadFileObj, filename, quillObj) => {
    console.log(
      "🚀 ~ file: editor.js ~ line 37 ~ MyComponent ~ uploadFiles ~ quillObj",
      quillObj
    );
    console.log(
      "🚀 ~ file: editor.js ~ line 37 ~ MyComponent ~ uploadFiles ~ filename",
      filename
    );
    console.log(
      "🚀 ~ file: editor.js ~ line 37 ~ MyComponent ~ uploadFiles ~ uploadFileObj",
      uploadFileObj
    );

    const range = quillObj.getEditorSelection();
    const res = "http://localhost:8000/test.png";
    quillObj.getEditor().insertEmbed(range.index, "image", res);
  };

  return (
    <Form.Item
      label={props.display}
      name={props.name}
      initialValue={props.value}
      rules={rules}
    >
      <ReactQuill
        ref={(el) => {
          quillObj = el;
        }}
        modules={{
          toolbar: {
            container: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ align: [] }],
              ["link", "image"],
              ["clean", "code-block"],
              [{ color: [] }],
            ],
            handlers: {
              image: imageHandler,
            },
          },
          htmlEditButton: {},
        }}
        placeholder="Add a description of your event"
        id="txtDescription"
      />
    </Form.Item>
  );
};
export default MyComponent;
