import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import {useLocalState} from "../../Utilities/useLocalState.js";
import {jwtDecode} from "jwt-decode";

function FavouriteProducts() {
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
                const userFetch = await fetch(`http://localhost:8080/users/viewUser`, {
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
                const productsFetch = await fetch(`http://localhost:8080/favoriteProducts/viewFavoriteProducts/${userDetails.id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`
                    },
                    method: 'GET',
                });
                const productsDetails = await productsFetch.json();
                setProducts(productsDetails)
                console.log(productsDetails)
            } catch (error) {
                console.error('Error:', error);
            }
        };
        // Call the fetchData function
        fetchData();
    }, [])

    function saveAsFavourite(product) {
        const favouriteProduct = {
            productId: {
                id: product.productId.id
            },
            userId: {
                id: user
            }
        }
        console.log(`Saving as favourite ${product.productId.id}`)
        fetch(`http://localhost:8080/favoriteProducts/toggleProduct`, {
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
            })
            .catch((error) => {
                console.error('Error saving product:', error);
            });
    }

    return (
        <>
            {
                products ? (
                        products.map((product) => (
                            <div key={product.id}>
                                <Link to={`${product.id}`}><span>{product.id}</span></Link>
                                <span>{product.name}</span>
                                <span>{product.price}</span>
                                <span><Button variant="warning"><Link
                                    to={`/editProducts/${product.id}`}>Edit</Link></Button></span>
                                <span><Button variant="primary"
                                              onClick={() => saveAsFavourite(product)}><FontAwesomeIcon icon={faHeart}
                                                                                                        size={"xl"}/></Button></span>
                            </div>
                        )))
                    : (<></>)}
        </>
    )
}

export default FavouriteProducts