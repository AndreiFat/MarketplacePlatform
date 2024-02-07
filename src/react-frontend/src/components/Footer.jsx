import {Col, Container, Row} from "react-bootstrap";
import {Link} from "react-router-dom";

function Footer() {
    return (
        <>
            <Container fluid className={"mt-4 bg-dark"}>
                <Container>

                    <Row className={"py-5"}>
                        <h4 className={"text-white mb-4"}>Developers</h4>
                        <Col className={""}>
                            <Link
                                className={"text-decoration-none btn btn-outline-light rounded-pill px-4 py-3"}
                                to={"https://github.com/AndreiFat"}>
                                <img className={" rounded-circle"} height={"70px"} width={"70px"}
                                     src="/andrei.jpeg" alt=""/>
                                <span className={"mx-3  fs-5"}>Andrei Fat</span>
                            </Link>
                        </Col>
                        <Col>
                            <Link
                                className={"text-decoration-none btn btn-outline-light rounded-pill px-4 py-3"}
                                to={"https://github.com/AndreeaTatar16"}>
                                <img className={"rounded-circle"} height={"70px"} width={"70px"}
                                     src="/img.png" alt=""/>
                                <span className={"mx-3 fs-5"}>Andreea Tatar</span>
                            </Link>

                        </Col>
                    </Row>
                </Container>
            </Container>
        </>
    )
}

export default Footer