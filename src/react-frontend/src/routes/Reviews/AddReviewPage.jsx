import {Link, useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function AddReviewPage() {
    //productId o sa fie luat din url
    const {productId} = useParams();
    console.log(productId)

    const [description, setDescription] = useState('');
    const [numberOfStars, setNumberOfStars] = useState(0);

    const navigate = useNavigate();

    const handleSubmitReview = (e) => {
        e.preventDefault();


        const review = {
            description,
            numberOfStars,
            productId: {
                id: productId
            },
            userId: {
                id: 1    //momentan default user-ul!!!
            }
        };

        fetch(`http://localhost:8080/products/${productId}/addReview`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: 'POST',
            body: JSON.stringify(review),
        }).then((response) => response.json())
            .then((review) => {
                console.log(review);
                navigate(`/${productId}`);   //redirect catre pagina de vizualizare a produsului
            });
    }

    return (
        <>
            <div>Here is the review page</div>

            <Form>
                <Form.Group className="mb-3" name="description" value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            controlId="exampleForm.description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text"/>
                </Form.Group>

                <Form.Group className="mb-3" name="numberOfStars" value={numberOfStars}
                            onChange={(e) => setNumberOfStars(e.target.value)}
                            controlId="exampleForm.numberOfStars">
                    <Form.Label>Number of stars</Form.Label>
                    <Form.Control type="number"/>
                </Form.Group>

                <Form.Group>
                    <Button color="primary" type="submit" onClick={handleSubmitReview}>Add review</Button>
                    <Button variant="danger"><Link to={'/'}>Cancel</Link></Button>
                </Form.Group>
            </Form>
        </>
    )
}

export default AddReviewPage