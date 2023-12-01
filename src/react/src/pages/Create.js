import { useParams, useSearchParams } from "react-router-dom";

import Form from "../blocks/Form";

const Create = () => {
  const [urlParams] = useSearchParams();
  const pageId = urlParams.get("id");

  const { pageModule } = useParams();
  return (
    <div
      className={`page page-${pageModule} ${pageModule}-${pageId} ${
        pageId ? "edit" : "create"
      }`}
    >
      {/*<Header/>*/}
      <Form />
    </div>
  );
};

export default Create;
