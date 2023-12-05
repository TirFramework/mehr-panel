import { useParams, useSearchParams } from "react-router-dom";

import Form from "../blocks/Form";
import { MyProvider } from "../context/MyContext";

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
      <MyProvider>
        {/*<Header/>*/}
        <Form type={"create-edit"} />
      </MyProvider>
    </div>
  );
};

export default Create;
