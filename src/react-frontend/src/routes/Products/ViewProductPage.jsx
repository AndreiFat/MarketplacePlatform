import {Link, useParams} from "react-router-dom";
import Button from "react-bootstrap/Button";
import {useEffect, useState} from "react";
import {useLocalState} from "../../Utilities/useLocalState.js";

import {Form, Modal} from "react-bootstrap";
import {jwtDecode} from "jwt-decode";

function ViewProductPage() {

    const [jwt, setJwt] = useLocalState("", "jwt");
    const {productId} = useParams();
    console.log(productId);

    const [jwt, setJwt] = useLocalState("", "jwt");
    const decodedToken = jwtDecode(jwt);
    const userEmail = decodedToken.sub;
    console.log("decodat " + userEmail);

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
    const [numberOfStarsEdit, setNumberOfStarsEdit] = useState(0);

    useEffect(() => {
        fetch(`http://localhost:8080/products/${productId}`, {
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
        fetch(`http://localhost:8080/products/${productId}/viewReviews`, {
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
        fetch(`http://localhost:8080/products/deleteReview/${reviewId}`, {
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

        fetch(`http://localhost:8080/products/editReview/${reviewId}`, {
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

    return (
        <>
            <p> aici va fi pagina produsului cu id ul {productId}</p>
            <div>Titlul produsului: <b>{product.name}</b></div>
            <div>Descriere: {product.description}</div>
            <div>Categoria: {product.categoryId.id} {product.categoryId.name}</div>
            <div>Pret: {product.price} $</div>
            <div>Stoc: {product.stock}</div>
            <div>Rating: {product.rating}</div>
            {/*<img src={`http://localhost:8080/${product.images[0].imagePath}`} alt=""/>*/}
            {
                product.images ? (
                    product.images.map((image) => (
                        <img height="100px" width="100px" key={image.id}
                             src={`data:image/jpeg;base64,${image.imageData}`}
                             alt={image.name}/>
                    ))

                ) : <></>
            }
            <span><Button variant="info"><Link
                to={`/${product.id}/addReview`}>Add review</Link></Button></span>

            <p>aici o sa fie si review-urile la produsul cu id-ul {productId}</p>
            {
                reviews ? (
                        reviews.map((review) => (
                            <div key={review.id}>
                                <span>Descriere review: {review.description}</span>
                                <span>Number of stars: {review.numberOfStars} * </span>

                                {verifyOwnerOfReview(review.userId.email) ? <div>
                                <span><Button variant="warning" data-id={review.id}
                                              onClick={() => handleShowForEdit(review.id, review.description, review.numberOfStars)}>Edit review</Button></span>
                                        <span><Button variant="danger" data-id={review.id}
                                                      onClick={() => deleteReviewByUser(review.id)}>Delete review</Button></span>
                                    </div>
                                    : <div><p>nu este owner ul</p></div>}
                            </div>
                        )))
                    : (<></>)
            }

            {
                reviews ? (
                        reviews.map((review) => (
                            <Modal key={review.id} show={showModals[review.id] || false}
                                   onHide={() => handleCloseForEdit(review.id)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>{review.id}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {review.id}
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
                                            <Form.Control
                                                type="number"
                                                value={numberOfStarsEdit}
                                                autoFocus
                                                onChange={(e) => setNumberOfStarsEdit(e.target.value)}
                                            />
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

        </>
    )
}

export default ViewProductPage