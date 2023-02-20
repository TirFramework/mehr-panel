import { useParams } from "react-router-dom";

import { useUrlParams } from "../hooks/useUrlParams";
import Form from "../blocks/Form";
import Header from "../blocks/Header";

const Create = () => {

  const [urlParams, , setUrlParams] = useUrlParams();
  const pageId = urlParams.id;

  const { pageModule } = useParams();
  const { pageType } = useParams();

    return (
    <div
      className={`page page-${pageModule} ${pageModule}-${pageId} ${
        pageId ? "edit" : "create"
      }`}
    >
        <Header/>
        <Form/>
    </div>
  );
};

export default Create;
