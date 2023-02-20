import {Link} from "react-router-dom";
import Form from "../blocks/Form";
import {Card, Col, Row} from "antd";
import Header from "../blocks/Header";


const Document = () => {
    return (
        <>
            <Header/>
            <Row>

                <Col span={4}>
                    <Card>
                        <Link to={"/admin/custom/document?id=63c550c909f6740b1609f73e"}> step1 </Link>
                        <Link to={"/admin/custom/generalOriginal?id=63c550c909f6740b1609f73e"}> step2 </Link>
                    </Card>
                </Col>

                <Col span={20}>

                    <Form/>

                </Col>
            </Row>


        </>
    );
};

export default Document;
