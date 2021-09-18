import React from "react";
import { Form } from "antd";
// import reactDom from "react-dom";

import * as api from "../api";

import ReactQuill, { Quill } from "react-quill";
import { htmlEditButton } from "quill-html-edit-button";

import "react-quill/dist/quill.snow.css";

import { separationRules } from "../lib/helpers";
import axios from "axios";

import Cookies from "js-cookie";

import Config from "../constants/config";

const token = Cookies.get('api_token')


Quill.register("modules/htmlEditButton", htmlEditButton);

var quillObj;

const MyComponent = (props) => {
  // console.log("🚀 ~ file: editor.js ~ line 17 ~ MyComponent ~ props", props);

  // const rules = separationRules({
  //   pageType: props.pageType,
  //   rules: props.rules,
  //   creationRules: props.creationRules,
  //   updateRules: props.updateRules,
  // });

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

    //To Upload in root folder
    const apiUrl = `${Config.apiBaseUrl}/file-manager/upload`;
    //         fetch(apiUrl, {
    //           method: 'POST',
    //           headers: {
    //             'Authorization': 'Bearer a',
    //             'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryjev5IHKBpr4jAjcB',
    //             "X-RequestDigest": 'XMLHttpRequest'
    //           },
    //           body: uploadFileObj // This is your file object
    //         }).then((response) => {
    //           console.log("🚀 ~ file: editor.js ~ line 98 ~ uploadFiles ~ response", response)

    //           const range = quillObj.getEditorSelection();

    //           var res = filename;

    //           quillObj.getEditor().insertEmbed(range.index, 'image', res);
    //         }).catch((error) =>
    //           console.log(error)
    //         );


    const formData = new FormData()
    if (uploadFileObj !== null) {
        formData.append('file', uploadFileObj)
    }

    const file = uploadFileObj
    if (file !== "") {
      axios
        .post(
          apiUrl,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "multipart/form-data; boundary=----WebKitFormBoundaryjev5IHKBpr4jAjcB",
              "X-RequestDigest": "XMLHttpRequest",
            },
          }
        )
        .then((response) => {
          console.log(
            "🚀 ~ file: editor.js ~ line 98 ~ uploadFiles ~ response",
            response
          );

          const range = quillObj.getEditorSelection();

          const res = `${Config.storage}/${response.data.path}`;

          quillObj.getEditor().insertEmbed(range.index, "image", res);
        })
        .catch((error) =>
          console.log(
            "🚀 ~ file: editor.js ~ line 121 ~ uploadFiles ~ error",
            error
          )
        );
    }
  };

  return (
    <Form.Item
      label={props.display}
      name={props.name}
      initialValue={props.value}
      // rules={rules}
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
