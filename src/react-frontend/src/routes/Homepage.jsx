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
    const [images, setImages] = useState(null)


    useEffect(() => {
        const fetchData = async () => {

            try {
                //First Fetch
                const productFetch = await fetch('http://localhost:8080/products/viewProducts', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                    method: 'GET',

                });
                const productDetails = await productFetch.json();
                if (productDetails) {
                    console.log(productDetails);
                    setProducts(productDetails);
                } else {
                    console.error('User details are null or undefined.');
                }
                // Second Fetch
                const imagesFetch = await fetch(`http://localhost:8080/products/getAllImages/1`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                    method: 'GET',
                });
                const imageDetails = await imagesFetch.json();
                if (imageDetails) {
                    console.log(imageDetails);
                    setImages(imageDetails);
                } else {
                    console.error('User details are null or undefined.');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
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
                id: 1
            }
        }
        console.log(`Saving as favourite ${productId}`)
        fetch(`http://localhost:8080/favoriteProducts/toggleProduct`, {
            headers: {
                "Content-Type": "application/json",
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
                                {
                                    product.images ? (
                                        product.images.map((image) => (
                                            <img height="100px" width="100px" key={image.id}
                                                 src={`data:image/jpeg;base64,${image.imageData}`}
                                                 alt={image.name}/>
                                        ))

                                    ) : <></>
                                }
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