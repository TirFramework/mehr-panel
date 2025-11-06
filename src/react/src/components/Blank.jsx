import React from "react";
const Blank = (props) => {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: props.value }}></div>
    </>
  );
};

export default Blank;
