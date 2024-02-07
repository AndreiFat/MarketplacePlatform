import Accordion from 'react-bootstrap/Accordion';
import Button from "react-bootstrap/Button";
import {Col, Row} from "react-bootstrap";
import StarRating from "./StarRating.jsx";

function ProductAccordion({review, verifyOwnerOfReview, handleShowForEdit, deleteReviewByUser}) {
    return (
        review ? (
            <Accordion.Item eventKey={review.id}>
                <Accordion.Header>
                    <Row className={"w-100"}>
                        <Col md={8} className={"d-flex"}>
                            <span className={"my-auto"}><h5
                                className={"mb-0"}>{review.userId.name} {review.userId.surname}</h5></span>
                        </Col>
                        <Col className={"d-flex justify-content-end"} md={4}>
                            <h5 className={"me-3 my-auto"}>
                                <StarRating
                                    rating={review.numberOfStars.toString()}></StarRating>
                            </h5></Col>
                    </Row>
                </Accordion.Header>
                <Accordion.Body>

                    <Row className={"justify-content-end"}>
                        <Col md={8}>{review.description}</Col>
                        <Col md={4} className={"d-flex justify-content-end"}>{verifyOwnerOfReview(review.userId.email) ?
                            <div>
                                <div>
                                </div>
                                <span><Button variant="warning" data-id={review.id}
                                              className={"me-3 py-2 px-4"}
                                              onClick={() => handleShowForEdit(review.id, review.description, review.numberOfStars)}>Edit review</Button>
                                            </span>
                                <span><Button variant="danger" data-id={review.id} className={"py-2 px-4"}
                                              onClick={() => deleteReviewByUser(review.id)}>Delete review</Button></span>
                            </div>
                            : <div></div>}</Col>
                    </Row>

                </Accordion.Body>
            </Accordion.Item>
        ) : (<></>)
    );
}

export default ProductAccordion;