import { useParams } from "react-router-dom";
import {Breadcrumb, Typography} from "antd";
const Header = () => {

    const { pageModule } = useParams();
    const { pageType } = useParams();

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item className="capitalize">{pageModule}</Breadcrumb.Item>
                <Breadcrumb.Item className="capitalize">{pageType}</Breadcrumb.Item>
            </Breadcrumb>
            <Typography.Title className="capitalize">
                {pageModule}
            </Typography.Title>
        </>
    );
};

export default Header;
