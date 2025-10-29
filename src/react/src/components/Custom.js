// Example one
// import { Form } from "antd";
// import { useEffect, useState } from "react";
// import Group from "./Group";

// const CustomUserFilter = ({ form, ...props }) => {
//   const [children, setChildren] = useState(props.children);
//   const isForAllUsers = Form.useWatch("is_for_all_users", form);

//   useEffect(() => {
//     const updatedChildren = props.children.map((field) => {
//       if (field.name === "recipients") {
//         return {
//           ...field,
//           existent: isForAllUsers === false,
//         };
//       }
//       return field;
//     });

//     setChildren(updatedChildren);
//   }, [isForAllUsers, props.children]);

//   return <Group {...props} children={children} showCard={false} />;
// };

// export default CustomUserFilter;

const Custom = () => {
  return <h1>Custom</h1>;
};

export default Custom;
