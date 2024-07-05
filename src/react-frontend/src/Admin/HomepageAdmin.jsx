import AdminRoute from "../Utilities/AdminRoute.jsx";
import {Card, Col, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useLocalState} from "../Utilities/useLocalState.js";
import ProductAdmin from "../components/ProductAdmin.jsx";
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";

function HomepageAdmin() {
    const apiURL = import.meta.env.VITE_API_URL;
    const [products, setProducts] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [jwt, setJwt] = useLocalState("", "jwt");

    useEffect(() => {
        const fetchData = async () => {

            try {
                //First Fetch
                const productFetch = await fetch(`${apiURL}/products/viewProducts`, {
                    headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${jwt}`,
                    },
                    method: 'GET',

                });
                const productDetails = await productFetch.json();
                if (productDetails) {
                    console.log(productDetails);
                    setProducts(productDetails);
                } else {
                    console.error('Product details are null or undefined.');
                }

            } catch (error) {
                console.error('Error:', error);
            }
        }
        // if (jwt) {
        //     // Decode JWT
        //     const decoded = jwtDecode(jwt);
        //
        //     // Check if JWT is expired
        //     const currentTime = Date.now() / 1000;
        //     if (decoded.exp < currentTime) {
        //         // JWT expired, user is not logged in
        //         setLoggedIn(false);
        //     } else {
        //         // JWT valid, user is logged in
        //         setLoggedIn(true);
        //     }
        // } else {
        //     Cookies.remove('order');
        //     // No JWT found, user is not logged in
        //     setLoggedIn(false);
        // }
        fetchData();
    }, []);

    function deleteProduct(productId) {
        fetch(`${apiURL}/products/deleteProduct/${productId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${jwt}`,
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    window.location.reload()
                } else {
                    console.log("Failed to delete!")
                }
            })
            .catch((error) => {
                console.error('Error deleting product:', error);
            });
    }

    return (
        <>
            <Row>
                <Col>
                    <Card className={"rounded-4 border-0"}>
                        <Card.Body>
                            <span className={"me-3"}>
                                <Button variant={"dark"} className={"rounded-4 px-4 py-3"}><Link
                                    className={"text-decoration-none text-white"}
                                    to={"/addingProducts"}>Add Products</Link></Button>
                            </span>
                            <span className={"me-3"}>
                            <Button variant={"dark"} className={"rounded-4 px-4 py-3"}><Link
                                className={"text-decoration-none text-white"}
                                to={"/admin/manageDiscountCoupons"}>View Discount Coupons</Link></Button>
                        </span>
                            <span className={"me-3"}>
                            <Button variant={"dark"} className={"rounded-4 px-4 py-3"}><Link
                                className={"text-decoration-none text-white"}
                                to={"/admin/manageCategories"}>View Categories</Link></Button>
                        </span>
                            <span className={"me-3"}>
                            <Button variant={"dark"} className={"rounded-4 px-4 py-3"}><Link
                                className={"text-decoration-none text-white"}
                                to={"/admin/manageOrders"}>View Orders</Link></Button>
                        </span>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className={"my-3"}>
                {products ? (
                    products.map((product) => (
                        <ProductAdmin key={product.id} product={product}
                                      deleteProduct={deleteProduct}></ProductAdmin>

                    ))) : (<></>)}

            </Row>

        </>
    )
}

export default AdminRoute(HomepageAdmin)