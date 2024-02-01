import {Col, Container, Row} from "react-bootstrap";

function Footer() {
    return (
        <>
            <Container fluid className={"mt-4 bg-dark"}>
                <Container>

                    <Row className={"py-5"}>
                        <h4 className={"text-white"}>Footer</h4>
                        <Col>
                            <span className={"text-white"}>Foarte tare ceva aici</span>
                        </Col>
                        <Col>
                            <span className={"text-white"}>Ceva si mai tare aici</span>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </>
    )
}

export default Footer