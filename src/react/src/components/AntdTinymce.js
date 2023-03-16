import React from "react";
import { Editor as TinymceReact } from "@tinymce/tinymce-react";

import * as api from "../api";
import Config from "../constants/config";

// apiKey for TinyMCE
let apiKey = "o4q336rx7k6aue62ztwgu91ba47gkw9dnogxhz1bfnvmzefo";

class Editor extends React.Component {
  render() {
    const { value, onChange, ...props } = this.props;

    return (
      <TinymceReact
        // {...props}
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

          toolbar: `undo redo | formatselect | image 
          bold italic backcolor | alignleft aligncenter
          alignright alignjustify | bullist numlist 
          outdent indent | removeformat | help code`,

          image_title: true,
          automatic_uploads: true,
          file_picker_types: "image",
          height: 500,
        }}
        onChange={(e) => {
          onChange(e.target.getContent());
        }}
      />
    );
  }
}

export default Editor;
