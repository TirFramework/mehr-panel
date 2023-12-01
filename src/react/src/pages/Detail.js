import { useParams, useSearchParams } from "react-router-dom";

import Form from "../blocks/Form";
import Header from "../blocks/Header";

const Detail = () => {
  let [urlParams] = useSearchParams();
  const pageId = urlParams.get("id");

  const { pageModule } = useParams();
  const { pageType } = useParams();
  return (
    <div className={`page detail page-${pageModule} ${pageModule}-${pageId}`}>
      {/*<Header/>*/}
      <Form type={"detail"} />
    </div>
  );
};

export default Detail;
