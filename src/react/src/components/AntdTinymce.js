import React from "react";
import { Editor as TinymceReact } from "@tinymce/tinymce-react";

import * as api from "../api";
import Config from "../constants/config";
import useLocalStorage from "../hooks/useLocalStorage";

// apiKey for TinyMCE
let apiKey = Config.tinyemcApiKey;
export default function Editor({ value, onChange, ...props }) {
  const [isDarkMode, setIsDarkMode] = useLocalStorage("mode", { mode: false });

  return (
    <TinymceReact
      // {...props}
      // value={value}
      apiKey={apiKey}
      initialValue={value}
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

        toolbar: `undo redo formatselect | image bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help code`,
        image_title: true,
        automatic_uploads: true,
        relative_urls: false,
        remove_script_host: false,
        convert_urls: false,
        skin: isDarkMode.mode ? "oxide-dark" : "oxide",
        content_css: isDarkMode.mode ? "dark" : "default",
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
                .uploadImage(props.uploadUrl, file)
                .then((res) => {
                  cb(`${props.basePath}${res.path}`);
                })
                .catch((err) => {
                  // console.log(
                  //   "🚀 ~ file: Dashboard.js ~ line 95 ~ Index ~ err",
                  //   err
                  // );
                });

              /* call the callback and populate the Title field with the file name */
            };
            reader.readAsDataURL(file);
          };

          input.click();
        },
        height: props.height || 500,
      }}
      // onChange={(e) => {
      //   onChange(e.target.getContent());
      // }}
      onBlur={(e) => {
        onChange(e.target.getContent());
      }}
    />
  );
}
