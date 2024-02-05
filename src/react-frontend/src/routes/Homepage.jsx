import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useLocalState} from "../Utilities/useLocalState.js";
import {jwtDecode} from 'jwt-decode';

function Homepage() {

    const navigate = useNavigate();
    const [jwt, setJwt] = useLocalState("", "jwt");

    const decodedToken = jwtDecode(jwt);
    const userRole = decodedToken.authorities;
    const isAdmin = userRole.includes('ROLE_ADMIN');

    const [products, setProducts] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/products/viewProducts', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                    method: 'GET',

                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch products. Status: ${response.status}`);
                }

                const productsData = await response.json();
                setProducts(productsData);
                console.log(productsData);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        console.log("called twice")
        fetchData();
    }, []);

    function deleteProduct(productId) {
        fetch(`http://localhost:8080/products/deleteProduct/${productId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.status === 200) {
                    navigate('/');
                } else {
                    console.log("Failed to delete!")
                }
            })
            .catch((error) => {
                console.error('Error deleting product:', error);
            });
    }

    function saveAsFavourite(productId) {
        const favouriteProduct = {
            productId: {
                id: productId
            },
            userId: {
                id: 2
            }
        }
        console.log(`Saving as favourite ${productId}`)
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
                } else {
                    console.log("Failed to save!")
                }
            })
            .catch((error) => {
                console.error('Error saving product:', error);
            });
    }

    return (
        <div className="container justify-content-center">
            {
                products ? (
                        products.map((product) => (
                            <div key={product.id}>
                                <Link to={`${product.id}`}><span>{product.id}</span></Link>
                                <span>{product.name}</span>
                                <span>{product.price}</span>
                                <span><Button variant="warning"><Link
                                    to={`/editProducts/${product.id}`}>Edit</Link></Button></span>
                                <span><Button variant="danger"
                                              onClick={() => deleteProduct(product.id)}>Delete</Button></span>
                                <span><Button variant="primary"
                                              onClick={() => saveAsFavourite(product.id)}><FontAwesomeIcon icon={faHeart}
                                                                                                           size={"xl"}/></Button></span>
                            </div>
                        )))
                    : (<></>)}
            <Button variant="light"><Link to={'/addingProducts'}>Add a product</Link></Button>
            {isAdmin && <Button variant="light"><Link to={'/manageCategories'}>Categories</Link></Button>}
            {isAdmin && <Button variant="light"><Link to={'/manageDiscountCoupons'}>DiscountCoupons</Link></Button>}
        </div>
    )
}

export default Homepage