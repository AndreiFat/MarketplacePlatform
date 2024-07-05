import {useNavigate, useParams} from "react-router-dom";
import Button from "react-bootstrap/Button";
import {useEffect, useState} from "react";
import {useLocalState} from "../../Utilities/useLocalState.js";

import {Breadcrumb, Card, Col, Form, Modal, Row} from "react-bootstrap";
import {jwtDecode} from "jwt-decode";
import ProductCarousel from "../../components/CarouelProduct.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBoxesStacked} from "@fortawesome/free-solid-svg-icons";
import StarRating from "../../components/StarRating.jsx";
import ReviewAccordion from "../../components/ReviewAccordion.jsx";
import Accordion from "react-bootstrap/Accordion";

function ViewProductPage() {
    const apiURL = import.meta.env.VITE_API_URL;
    const {productId} = useParams();
    console.log(productId);
    let userEmail = ""

    const [jwt, setJwt] = useLocalState("", "jwt");
    if (jwt !== "") {
        const decodedToken = jwtDecode(jwt);
        userEmail = decodedToken.sub;
        console.log("decodat " + userEmail);
    }


    const [user, setUser] = useState(null);
    const [description, setDescription] = useState('');
    const [numberOfStars, setNumberOfStars] = useState("5");

    const navigate = useNavigate();

    useEffect(() => {
        const userBody = {
            email: userEmail
        }
        const fetchData = async () => {
            try {
                const userFetch = await fetch(`${apiURL}/users/viewUser`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`
                    },
                    method: 'POST',
                    body: JSON.stringify(userBody),
                });
                const userDetails = await userFetch.json();
                if (userDetails) {
                    console.log("userul care vine" + userDetails.id);
                    setUser(userDetails);
                } else {
                    console.error('User details are null or undefined.');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, []);


    const handleSubmitReview = (e) => {
        e.preventDefault();

        const review = {
            description,
            numberOfStars,
            productId: {
                id: productId
            },
            userId: {
                id: user.id
            }
        };

        fetch(`${apiURL}/products/${productId}/addReview`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: 'POST',
            body: JSON.stringify(review),
        }).then((response) => response.json())
            .then((review) => {
                console.log(review);
                window.location.reload()
                handleClose()//redirect catre pagina de vizualizare a produsului
            });


    }

    const handleRadioChange = (event) => {
        setNumberOfStars(event.target.value);
    };
    const handleRadioChangeEdit = (event) => {
        setNumberOfStarsEdit(event.target.value);
    };

    function verifyOwnerOfReview(userOfReviewEmail) {
        return userEmail === userOfReviewEmail;
    }

    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: 0,
        categoryId: {
            id: null,
            name: ''
        },
        stock: 0,
        rating: 0,
    });
    const [reviews, setReviews] = useState(null);

    const [reviewDescriptionEdit, setReviewDescriptionEdit] = useState("");
    const [numberOfStarsEdit, setNumberOfStarsEdit] = useState("");

    useEffect(() => {
        fetch(`${apiURL}/products/${productId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            }, method: 'GET'
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
            })
            .then((data) => {
                setProduct(data)
                console.log(data)
            });
    }, [productId]);

    useEffect(() => {
        fetch(`${apiURL}/products/${productId}/viewReviews`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: 'GET'
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((reviewsData) => {
                setReviews(reviewsData);
                console.log(reviewsData);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    function deleteReviewByUser(reviewId) {
        fetch(`${apiURL}/products/deleteReview/${reviewId}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            },
            method: 'DELETE',
        })
            .then((response) => {
                if (response.status === 200) {
                    window.location.reload();
                } else {
                    console.log("Failed to delete!")
                }
            })
            .catch((error) => {
                console.error('Error deleting review:', error);
            });
    }

    const [showModals, setShowModals] = useState({});
    const handleShowForEdit = (reviewId, description, numberOfStars) => {
        setReviewDescriptionEdit(description);
        setNumberOfStarsEdit(numberOfStars);
        setShowModals((prevShowModals) => ({
            ...prevShowModals,
            [reviewId]: true,
        }));
    };

    const handleCloseForEdit = (categoryId) => {
        setReviewDescriptionEdit('');
        setNumberOfStarsEdit(0);
        setShowModals((prevShowModals) => ({
            ...prevShowModals,
            [categoryId]: false,
        }));
    };

    function editReviewByUser(reviewId) {
        const reviewBody = {
            description: reviewDescriptionEdit,
            numberOfStars: numberOfStarsEdit
        };

        fetch(`${apiURL}/products/editReview/${reviewId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: 'PUT',
            body: JSON.stringify(reviewBody),
        }).then((response) => {
            console.log(response.status);
            window.location.reload();
        });
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    return (
        <>
            {
                product ? (
                    <>
                        <Breadcrumb className={"mt-5"}>
                            <Breadcrumb.Item href="/" className={"text-decoration-none"}>Store</Breadcrumb.Item>
                            <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
                        </Breadcrumb>
                        <Card className={"shadow-sm rounded-4 border-0 mt-3 mb-3"}>
                            <Card.Body className={"p-4"}>
                                <Row>
                                    <Col xl={6} md={6} className={"mb-md-0 mb-xl-0 mb-3"}>
                                        <ProductCarousel images={product.images}></ProductCarousel>
                                    </Col>
                                    <Col xl={6} md={6} className={"px-4"}>
                                        <div className={"pb-2"}><h1>{product.name}</h1></div>
                                        <h4 className={"pb-2"}>
                                            <StarRating
                                                rating={product.rating.toString()}></StarRating>
                                        </h4>
                                        <div className="pb-2"><h5>Description</h5>
                                            <p className={"fs-6"}>{product.description}</p></div>

                                        <div className={"pb-2"}>
                                            <h5>Category</h5>
                                            <p className={"fs-6 mb-0"}>{product.categoryId.name}</p>
                                        </div>

                                        <hr style={{borderTop: '2px solid #808080'}}/>

                                        <Row>
                                            <Col md={7}>
                                                <div className="">
                                                    <span className={"fs-2 me-3"}>Price :</span>
                                                    <span className="fs-2 mb-0 fw-bold">
                                                        {product.price} Ron
                                                    </span>
                                                </div>
                                            </Col>
                                            <Col md={5}>
                                                <div className="py-2">
                                                    {
                                                        product.stock > 0 ? (
                                                            <h5 className={"text-success m-0"}><FontAwesomeIcon
                                                                icon={faBoxesStacked}
                                                                className={"me-1"}/> Available
                                                                on
                                                                stock</h5>
                                                        ) : (
                                                            <h5 className={"text-danger m-0"}><FontAwesomeIcon
                                                                icon={faBoxesStacked}
                                                                className={"me-1"}/> Out
                                                                of
                                                                stock
                                                            </h5>)
                                                    }
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>

                                </Row>
                            </Card.Body>
                        </Card>

                        <Row className={"my-4"}>
                            <Col md={10}>
                                <h3>Reviews</h3>
                            </Col>

                            {
                                (userEmail !== "") ? (
                                    <><Col md={2} className={"d-flex justify-content-end"}><Button variant="primary"
                                                                                                   onClick={handleShow}
                                                                                                   className={"rounded-4 py-2 px-3"}
                                    >
                                        Add a review
                                    </Button> </Col></>
                                ) : (<><p>You can add reviews only if you have an account</p></>)
                            }
                        </Row>


                    </>
                ) : (<></>)
            }
            <Accordion defaultActiveKey="1">
                {
                    reviews ? (
                            reviews.map((review) => (
                                <div key={review.id}>
                                    <ReviewAccordion review={review} deleteReviewByUser={deleteReviewByUser}
                                                     verifyOwnerOfReview={verifyOwnerOfReview}
                                                     handleShowForEdit={handleShowForEdit}></ReviewAccordion>
                                </div>
                            )))
                        : (<></>
                        )
                }
                {
                    reviews ? (
                            reviews.map((review) => (
                                <Modal key={review.id} show={showModals[review.id] || false}
                                       onHide={() => handleCloseForEdit(review.id)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Edit review</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form>
                                            <Form.Group className="mb-3" controlId="exampleForm.reviewDescription">
                                                <Form.Label>Review Description</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={reviewDescriptionEdit}
                                                    autoFocus
                                                    onChange={(e) => setReviewDescriptionEdit(e.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.numberOfStars">
                                                <Form.Label>Number of Stars</Form.Label>

                                                <div className="button-radio-group mb-4">
                                                    {[1, 2, 3, 4, 5].map((value) => (
                                                        <label key={value}
                                                               className={`radio-button ${numberOfStarsEdit === value.toString() ? 'selected' : ''}`}>
                                                            <input
                                                                type="radio"
                                                                value={value}
                                                                checked={numberOfStarsEdit === value.toString()}
                                                                onChange={handleRadioChangeEdit}
                                                            />
                                                            {value}
                                                        </label>
                                                    ))}
                                                </div>

                                                {/*<Form.Control*/}
                                                {/*    type="number"*/}
                                                {/*    value={numberOfStarsEdit}*/}
                                                {/*    autoFocus*/}
                                                {/*    onChange={(e) => setNumberOfStarsEdit(e.target.value)}*/}
                                                {/*/>*/}
                                            </Form.Group>
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => handleCloseForEdit(review.id)}>
                                            Close
                                        </Button>
                                        <Button variant="primary" type="submit" onClick={() => editReviewByUser(review.id)}>
                                            Save Changes
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            )))
                        : (<></>)
                }
            </Accordion>
            <Modal show={show} onHide={handleClose}>
                <Form>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Group className="mb-3" name="description" value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    controlId="exampleForm.description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text"/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Rating</Form.Label>
                            <div className="button-radio-group mb-4">
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <label key={value}
                                           className={`radio-button ${numberOfStars === value.toString() ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            value={value}
                                            checked={numberOfStars === value.toString()}
                                            onChange={handleRadioChange}
                                        />
                                        {value}
                                    </label>
                                ))}
                            </div>
                        </Form.Group>


                    </Modal.Body>
                    <Modal.Footer>
                        <Form.Group className={"d-flex justify-content-end"}>
                            <Button variant="secondary" className={"me-3"} onClick={handleClose}>Cancel</Button>
                            <Button className={"me-3"} color="primary" type="submit" onClick={handleSubmitReview}>Add
                                review</Button>
                        </Form.Group>
                    </Modal.Footer>
                </Form>
            </Modal>

        </>
    )
}

export default ViewProductPage