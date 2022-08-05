import React from "react";
import { Editor as TinymceReact } from "@tinymce/tinymce-react";

import * as api from "../api";
import Config from "../constants/config";

// apiKey for TinyMCE
let apiKey = "o4q336rx7k6aue62ztwgu91ba47gkw9dnogxhz1bfnvmzefo";

class Editor extends React.Component {
  render() {
    console.log("🚀 ~ file: AntdTinymce.js ~ line 11 ~ Editor");
    const { value, onChange, ...props } = this.props;

    return (
      <TinymceReact
        {...props}
        apiKey={apiKey}
        // initialValue={value}
        init={{
          plugins: [
            "lists",
            "link",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
            "image",
          ],

          toolbar: `undo redo | formatselect | image 
          bold italic backcolor | alignleft aligncenter
          alignright alignjustify | bullist numlist 
          outdent indent | removeformat | help code`,

          image_title: true,
          automatic_uploads: true,
          file_picker_types: "image",
          file_picker_callback: function (cb, value, meta) {
            var input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");

            /*
              Note: In modern browsers input[type="file"] is functional without
              even adding it to the DOM, but that might not be the case in some older
              or quirky browsers like IE, so you might want to add it to the DOM
              just in case, and visually hide it. And do not forget do remove it
              once you do not need it anymore.
            */

            input.onchange = function () {
              var file = this.files[0];

              var reader = new FileReader();
              reader.onload = function () {
                api
                  .uploadImage(file)
                  .then((res) => {
                    cb(`${Config.storage}/${res.path}`);
                  })
                  .catch((err) => {
                    console.log(
                      "🚀 ~ file: Dashboard.js ~ line 95 ~ Index ~ err",
                      err
                    );
                  });

                /* call the callback and populate the Title field with the file name */
              };
              reader.readAsDataURL(file);
            };

            input.click();
          },
          height: 500,
        }}
        onChange={(e) => {
          console.log(
            "🚀 ~ file: AntdTinymce.js ~ line 87 ~ Editor ~ render ~ e.target.getContent()",
            e.target.getContent()
          );
          onChange(e.target.getContent());
        }}
      />
    );
  }
}

export default Editor;
