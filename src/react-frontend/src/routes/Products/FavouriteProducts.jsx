import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBoxesStacked, faHeart} from "@fortawesome/free-solid-svg-icons";
import {useLocalState} from "../../Utilities/useLocalState.js";
import {jwtDecode} from "jwt-decode";
import PrivateRoute from "../../Utilities/PrivateRoute.jsx";
import {Card, Col, Row} from "react-bootstrap";
import StarRating from "../../components/StarRating.jsx";


function FavouriteProducts() {
    const apiURL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [jwt, setJwt] = useLocalState("", "jwt");

    const decodedToken = jwtDecode(jwt);
    const userEmail = decodedToken.sub;

    console.log(userEmail)

    const [user, setUser] = useState(null);
    const [products, setProducts] = useState(null);


    useEffect(() => {
        const userBody = {
            email: userEmail
        }

        const fetchData = async () => {
            try {
                // First fetch
                const userFetch = await fetch(`${apiURL}/users/viewUser`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`
                    },
                    method: 'POST',
                    body: JSON.stringify(userBody)
                });
                const userDetails = await userFetch.json();
                // Check if userDetails is not null or undefined before accessing properties
                if (userDetails) {
                    console.log(userDetails);
                    setUser(userDetails);
                } else {
                    console.error('User details are null or undefined.');
                }

                // Second fetch using data from the first fetch
                const productsFetch = await fetch(`${apiURL}/favoriteProducts/viewFavoriteProducts/`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`
                    },
                    method: 'GET',
                });
                const productsDetails = await productsFetch.json();
                setProducts(productsDetails)
                console.log("set")
                console.log(productsDetails)
            } catch (error) {
                console.error('Error:', error);
            }
        };
        // Call the fetchData function
        fetchData();
    }, [])

    function saveAsFavourite(productId) {
        const favouriteProduct = {
            product: productId
        }
        console.log(`Saving as favourite ${productId}`)
        fetch(`${apiURL}/favoriteProducts/toggleProduct`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: 'POST',
            body: JSON.stringify(favouriteProduct),
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.status)
                    window.location.reload()
                } else {
                    console.log("Failed to save!")
                }
            }).then((data) => {
            console.log(data)
        }).catch((error) => {
            console.error('Error saving product:', error);
        });
    }

    return (
        <>
            <Row>
                {

                    (products && products.length !== 0) ? (
                            products.map((product) => (
                                <Col md={3} key={product.id}>
                                    <Card className={"mb-4 p-2 shadow-sm border-0 rounded-4"}>
                                        {product.images[0] ? (
                                            <Card.Img variant="top" height={"200px"}
                                                      className={"p-2 rounded-4"}
                                                      style={{objectFit: "cover", width: "100%"}}
                                                      src={`data:image/jpeg;base64,${product.images[0].imageData}`}
                                                      alt={product.images[0].name}/>) : <></>
                                        }
                                        <Card.Body>
                                            <Link to={`${product.id}`}
                                                  className={"text-decoration-none text-dark"}>
                                                <h4>{product.name}</h4>
                                                <h5 className={"text-secondary"}><b>{product.price} Ron</b></h5>
                                            </Link>
                                            <Row>
                                                <Col md={9}><StarRating
                                                    rating={product.rating}></StarRating>
                                                    <div id="product-stock" className={"py-1"}>
                                                        {
                                                            product.stock > 0 ? (
                                                                <p className={"text-success m-0"}><FontAwesomeIcon
                                                                    icon={faBoxesStacked}
                                                                    className={"me-1"}/> Available
                                                                    on
                                                                    stock</p>
                                                            ) : (<p className={"text-danger m-0"}><FontAwesomeIcon
                                                                icon={faBoxesStacked}
                                                                className={"me-1"}/> Out of
                                                                stock
                                                            </p>)
                                                        }
                                                    </div>
                                                </Col> <Col md={3}>
                                                 <span><Button variant="danger"
                                                               className={"border-2 py-2 rounded-4"}
                                                               onClick={() => saveAsFavourite(product.id)}>
                                                 <FontAwesomeIcon
                                                     className={"p-0-5"}
                                                     icon={faHeart}
                                                     size={"xl"}/></Button></span>
                                            </Col>
                                            </Row>
                                            <div className={"d-flex justify-content-center w-100"}>
                                                <div className="d-flex align-items-center">

                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )))
                        : (<Col><h3 className={"my-3"}>You have not saved any products yet!</h3></Col>)
                }
            </Row>
        </>
    )
}

export default PrivateRoute(FavouriteProducts)