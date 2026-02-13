import React from 'react';
import { useParams, useSearchParams } from "react-router-dom";

import Form from "../blocks/Form";
import { MyProvider } from "../context/MyContext";

const Detail = () => {
  let [urlParams] = useSearchParams();
  const pageId = urlParams.get("id");

  const { pageModule } = useParams();
  return (
    <div className={`page detail page-${pageModule} ${pageModule}-${pageId}`}>
      <MyProvider>
        {/*<Header/>*/}
        <Form type={"detail"} />
      </MyProvider>
    </div>
  );
};

export default Detail;
