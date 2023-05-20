import { useParams } from "react-router-dom";

import { useUrlParams } from "../hooks/useUrlParams";
import Form from "../blocks/Form";
import Header from "../blocks/Header";

const Detail = () => {

  const [urlParams, , setUrlParams] = useUrlParams();
  const pageId = urlParams.id;

  const { pageModule } = useParams();
  const { pageType } = useParams();
    return (
    <div
      className={`page detail page-${pageModule} ${pageModule}-${pageId}` }
    >
        {/*<Header/>*/}
        <Form type={'detail'}/>
    </div>
  );
};

export default Detail;
