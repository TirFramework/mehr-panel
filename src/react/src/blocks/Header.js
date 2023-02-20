import { useParams } from "react-router-dom";
import {Breadcrumb, Typography} from "antd";
const Header = (props) => {

    const { pageModule } = useParams();
    const { pageType } = useParams();

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item className="capitalize">{props.pageTitle}</Breadcrumb.Item>
                <Breadcrumb.Item className="capitalize">{pageType}</Breadcrumb.Item>
            </Breadcrumb>
            <Typography.Title className="capitalize">
                {props.pageTitle}
            </Typography.Title>
        </>
    );
};

export default Header;
