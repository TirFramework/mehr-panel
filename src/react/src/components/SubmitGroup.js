import { Button, Space } from "antd";
// import { Link, useHistory, useParams } from "react-router-dom";
// import { useUrlParams } from "../hooks/useUrlParams";
import Field from "./Field";

const SubmitGroup = (props) => {
  // const [urlParams, , setUrlParams] = useUrlParams();
  // const pageId = urlParams.id;
  // const editMode = urlParams.editMode;
  // const { pageModule } = useParams();

  // const history = useHistory();

  // const goBack = () => {
  //   history.goBack();
  // };

  return (
    <Space className="justify-end flex mt-2">
      {props.buttons.map((btn, index) => (
        <Field
          key={`btn-${index}`}
          type={btn.action}
          loading={props.loading}
          {...props}
        />
      ))}
    </Space>
  );
  // return (
  //   <>
  //     {pageId ? (
  //       <>
  //         {editMode ? (
  //           <Space className="justify-end flex mt-2 w-full">
  //             <Button
  //               onClick={() => {
  //                 params.form.resetFields();
  //                 setUrlParams({ editMode: false });
  //               }}
  //             >
  //               Cancel
  //             </Button>

  //             <Button
  //               type="primary"
  //               htmlType="submit"
  //               loading={params.submitLoad}
  //             >
  //               Submit
  //             </Button>
  //           </Space>
  //         ) : (
  //           <Space className="justify-end flex mt-2 w-full">
  //             <Link to={`/admin/${pageModule}`}>
  //               <Button>Back</Button>
  //             </Link>

  //             <Button onClick={() => setUrlParams({ editMode: true })}>
  //               Edit
  //             </Button>
  //           </Space>
  //         )}
  //       </>
  //     ) : (
  //       <Space className="justify-end flex mt-2 w-full">
  //         <Link to={`/admin/${pageModule}`}>
  //           <Button>Back</Button>
  //         </Link>

  //         <Button type="primary" htmlType="submit" loading={params.loading}>
  //           Submit
  //         </Button>
  //       </Space>
  //     )}
  //   </>
  // );
};

export default SubmitGroup;
