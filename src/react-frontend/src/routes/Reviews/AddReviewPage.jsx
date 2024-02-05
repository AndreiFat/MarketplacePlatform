import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useLocalState} from "../../Utilities/useLocalState.js";
import {jwtDecode} from "jwt-decode";

function AddReviewPage() {
    //productId o sa fie luat din url
    const {productId} = useParams();
    const [jwt, setJwt] = useLocalState("", "jwt");

    const decodedToken = jwtDecode(jwt);
    const userEmail = decodedToken.sub;

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
                const userFetch = await fetch(`http://localhost:8080/users/viewUser`, {
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

        fetch(`http://localhost:8080/products/${productId}/addReview`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: 'POST',
            body: JSON.stringify(review),
        }).then((response) => response.json())
            .then((review) => {
                console.log(review);
                navigate(`/${productId}`);   //redirect catre pagina de vizualizare a produsului
            });
    }

    const handleRadioChange = (event) => {
        setNumberOfStars(event.target.value);
    };

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
                <Form.Group>
                    <Form.Label>Rating</Form.Label>
                    <div className="button-radio-group mb-3">
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
                <Form.Group>
                    <Button color="primary" type="submit" onClick={handleSubmitReview}>Add review</Button>
                    <Button variant="danger"><Link to={'/'}>Cancel</Link></Button>
                </Form.Group>
            </Form>
        </>
    )
}

export default AddReviewPage