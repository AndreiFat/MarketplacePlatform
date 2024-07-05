import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import {faCartShopping, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useLocalState} from "../Utilities/useLocalState.js";
import {Card, Col, Offcanvas, Row, Toast} from "react-bootstrap";
import Cookies from 'js-cookie';
import Form from "react-bootstrap/Form";
import Product from "../components/Product.jsx";
import HomePageCarousel from "../components/Carousel.jsx";
import {jwtDecode} from "jwt-decode";

function Homepage() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [message, setMessage] = useState("")
    const [showToast, setShowToast] = useState(false);

    const toggleShowToast = () => setShowToast(!showToast);

    const [show, setShow] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const navigate = useNavigate();

    //
    // const decodedToken = jwtDecode(jwt);
    // const userRole = decodedToken.authorities;
    // const isAdmin = userRole.includes('ROLE_ADMIN');
    // const userEmail = decodedToken.sub;

    const [products, setProducts] = useState(null);
    const [images, setImages] = useState(null);

    const [productsInOrder, setProductsInOrder] = useState([]);

    const [order, setOrder] = useState(() => {
        const storedOrder = Cookies.get('order');
        return storedOrder ? JSON.parse(storedOrder) : {
            productIds: [],
            quantity: 0,
            price: 0,
            address: {
                id: 0
            },
            discount: {
                id: 0
            }
        };
    });

    const [categories, setCategories] = useState(null);

    useEffect(() => {
        const fetchData = async () => {

            try {
                //First Fetch
                const productFetch = await fetch('http://localhost:8080/products/viewProducts', {
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
        if (jwt) {
            // Decode JWT
            const decoded = jwtDecode(jwt);

            // Check if JWT is expired
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                // JWT expired, user is not logged in
                setLoggedIn(false);
            } else {
                // JWT valid, user is logged in
                setLoggedIn(true);
            }
        } else {
            Cookies.remove('order');
            // No JWT found, user is not logged in
            setLoggedIn(false);
        }
        fetchData();
    }, []);

    function saveAsFavourite(productId) {
        const favouriteProduct = {
            product: productId
        }
        console.log(favouriteProduct)
        console.log(`Saving as favourite din homepage ${productId}`)
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
                    return response.json()
                } else {
                    console.log("Failed to save!")
                }
            }).then((data) => {
            console.log(data)
        })
            .catch((error) => {
                console.error('Error saving product:', error);
            });
    }

    // Function to serialize the order object
    const serializeOrder = (order) => {
        return JSON.stringify({
            ...order,
            productIds: order.productIds.map(item => ({...item}))
        });
    };

    useEffect(() => {
        // Manually serialize and save the order to cookies whenever it changes
        Cookies.set('order', serializeOrder(order), {expires: 365}); // Set expiration for 1 year
    }, [order]);

    function addToCart(productId, productPrice) {
        console.log(loggedIn)
        if (loggedIn) {
            const existingProductIndex = order.productIds.findIndex(item => item.id === productId);

            if (existingProductIndex !== -1) {
                // Product already exists in the order, increment the quantity
                const updatedProductIds = [...order.productIds];
                updatedProductIds[existingProductIndex].quantity += 1;

                const newOrder = {
                    ...order,
                    productIds: updatedProductIds,
                    quantity: order.quantity + 1,
                    price: order.price + productPrice
                };

                setOrder(newOrder);
                console.log(newOrder)
            } else {
                // Product is not in the order, add it with quantity 1
                const newOrder = {
                    ...order,
                    productIds: [
                        ...order.productIds,
                        {
                            id: productId,
                            quantity: 1
                        }
                    ],
                    quantity: order.quantity + 1,
                    price: order.price + productPrice
                };
                console.log(newOrder)
                setOrder(newOrder);
            }
        } else {
            setMessage("Please login before add products to cart!")
            toggleShowToast()
        }
    }

    const getProductsInOrder = () => {
        if (!products || !order.productIds) {
            // Handle the case when products or order.productIds is not available
            return [];
        }

        return order.productIds.map(orderItem => {
            const product = products.find(product => product.id === orderItem.id);
            return {
                ...product,
                quantity: orderItem.quantity
            };
        });
    };

    useEffect(() => {
        const updatedProductsInOrder = getProductsInOrder();
        console.log('Updated Products in Order:', updatedProductsInOrder);
        setProductsInOrder(updatedProductsInOrder);
    }, [order, products]); // Include products in the dependencies

    const [addresses, setAddresses] = useState(null);
    const [addressId, setAddressId] = useState("")
    const [discountCoupons, setDiscountCoupons] = useState(null);
    const [couponId, setCouponId] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const addressesFetch = await fetch(`http://localhost:8080/address/viewAddresses`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`
                    },
                    method: 'GET',
                });
                const addressesDetails = await addressesFetch.json();
                if (addressesDetails) {
                    console.log(addressesDetails)
                    setAddresses(addressesDetails);
                } else {
                    console.error('Address details are null or undefined.');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetch('http://localhost:8080/discountCoupons/viewCoupons', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: 'GET'
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((discountCouponsData) => {
                setDiscountCoupons(discountCouponsData);
                console.log(discountCouponsData);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });


        fetchData();
    }, []);

    function handleSubmitOrder() {
        const orderBody = {...order}
        orderBody.address.id = addressId
        orderBody.price = priceAfterDiscount();
        orderBody.discount.id = couponId
        console.log(orderBody)

        fetch('http://localhost:8080/orders/addOrder', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: 'POST',
            body: JSON.stringify(orderBody)
        }).then((response) => response.json())
            .then((order) => {
                console.log(order);
                Cookies.remove('order');
                window.location.reload();
            });
    }

    const [discountValue, setDiscountValue] = useState(0);

    useEffect(() => {
        // Calculate discount when the selected coupon changes
        if (couponId !== "") {
            const coupon = discountCoupons.find(coupon => String(coupon.id) === couponId);
            if (coupon) {
                // Assuming the coupon object has a 'discountValue' property
                const discount = coupon.discount || 0;
                setDiscountValue(discount);
            }
        } else {
            // Reset discount if no coupon is selected
            setDiscountValue(0);
        }
    }, [couponId, discountCoupons]);

    // Function to calculate the discounted price
    const calculateDiscountedPrice = () => {
        console.log(discountValue)
        const discountedPrice = (order.price * discountValue) / 100;
        return discountedPrice < 0 ? 0 : discountedPrice;
    };

    const priceAfterDiscount = () => {
        return order.price - calculateDiscountedPrice();
    }

    const verifyCategory = () => {
        return productsInOrder.find((product) => String(product.categoryId.id) === couponId)
    }

    const removeItemFromCart = (productId) => {
        console.log(productId)
        // Filter out the item with the specified productId from productsInOrder
        const updatedProductsInOrder = productsInOrder.filter(item => item.id !== productId);

        // Update the order state with the modified values
        updateOrder(updatedProductsInOrder);
    };

    // Function to update the order based on modified productsInOrder
    const updateOrder = (updatedProductsInOrder) => {
        // Calculate the updated quantity and price based on the remaining items
        const updatedQuantity = updatedProductsInOrder.reduce((total, item) => total + item.quantity, 0);
        const updatedPrice = updatedProductsInOrder.reduce((total, item) => {
            const product = products.find(product => product.id === item.id);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);

        // Update the order state with the modified values
        setOrder({
            ...order,
            productIds: updatedProductsInOrder.map(item => ({id: item.id, quantity: item.quantity})),
            quantity: updatedQuantity,
            price: updatedPrice,
        });

        // Update the productsInOrder state with the modified values
        setProductsInOrder(updatedProductsInOrder);
    };

    useEffect(() => {
        fetch('http://localhost:8080/categories/categories-with-products', {
            headers: {
                "Content-Type": "application/json",
                //Authorization: `Bearer ${jwt}`,
            },
            method: 'GET'
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((categoriesData) => {
                setCategories(categoriesData);
                console.log("categories")
                console.log(categoriesData)
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    return (
        <div className="container p-0 justify-content-center">
            <Row>
                <Col>
                    {categories ? (
                        categories.map((category) => (
                            <Link key={category.id} to={`/productsInCategory/${category.id}`}>
                                {category.name} <br/>
                            </Link>
                        ))) : (<></>)}
                </Col>
                <Col>
                    <HomePageCarousel></HomePageCarousel>
                </Col>
            </Row>
            <Row>
                {products ? (
                    products.map((product) => (
                        <Product key={product.id} product={product} addToCart={addToCart}
                                 saveAsFavourite={saveAsFavourite}></Product>

                    ))) : (<></>)}
            </Row>
            {/*{isAdmin && <Button variant="light"><Link to={'/addingProducts'}>Add a product</Link></Button>}*/}
            {/*{isAdmin && <Button variant="light"><Link to={'/manageCategories'}>Categories</Link></Button>}*/}
            {/*{isAdmin && <Button variant="light"><Link to={'/manageDiscountCoupons'}>DiscountCoupons</Link></Button>}*/}

            <div id="shopping-cart">
                <Button onClick={handleShow}
                    // onClick={openCart}
                        style={{width: "5rem", height: "5rem", borderColor: "#f2f8fa"}}
                        variant="dark"
                        className="rounded-circle floating-element border-3 shadow-sm"
                >
                    <FontAwesomeIcon icon={faCartShopping} size={"xl"}/>
                    <div
                        className="rounded-circle bg-danger d-flex justify-content-center align-items-center"
                        style={{
                            color: "white",
                            width: "2.5rem",
                            height: "2.5rem",
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            transform: "translate(25%, 25%)",
                        }}
                    >
                        {order.quantity}
                    </div>
                </Button>

                <Offcanvas show={show} onHide={handleClose} placement={"end"} name={"end"}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Shopping Cart</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        {
                            loggedIn ? (
                                <div>
                                    <h3>Products in Cart:</h3>
                                    {productsInOrder.map(product => (

                                        <Card key={product.id} className={"my-3 rounded-4"}>
                                            <Card.Body className={"p-4"}>
                                                <Row>
                                                    <Col md={8}>
                                                        <div className={""}>
                                                            <h5>{product.name}</h5>
                                                            <span
                                                                className={"fs-6 me-3"}><b>Quantity</b>: {product.quantity}</span>
                                                        </div>
                                                    </Col>
                                                    <Col md={4} className={"d-flex"}>
                                                         <span className={"my-auto"}>
                                                            <Button
                                                                className={"ms-5 btn btn-danger rounded-pill py-2"}
                                                                onClick={() => removeItemFromCart(product.id)}><FontAwesomeIcon
                                                                icon={faTrash} size={"lg"}/></Button>
                                                        </span>

                                                    </Col>
                                                </Row>


                                            </Card.Body>
                                        </Card>

                                    ))}

                                    <div className="offcanvas-footer d-block">
                                        <Form>
                                            <h3><b>Price</b> : {order.price} RON</h3>
                                            {couponId && verifyCategory() ? (
                                                <div>
                                                    <h5><b>Discount</b> : {calculateDiscountedPrice()} RON</h5>
                                                    <h5><b>Total Price</b> : {priceAfterDiscount()} RON</h5>
                                                </div>
                                            ) : (<></>)}
                                            <Form.Group className="my-3" name="couponId"

                                                        controlId="exampleForm.couponId">
                                                <Form.Label className={"me-3"}>Discount Coupons</Form.Label>
                                                <select name="couponId"
                                                        value={couponId}
                                                        onChange={(e) => setCouponId(e.target.value)}
                                                >
                                                    <option value="">Select</option>

                                                    {discountCoupons ?
                                                        (discountCoupons.map(discountCoupon => (
                                                            <option key={discountCoupon.id} value={discountCoupon.id}
                                                                    data-array={discountCoupons.indexOf(discountCoupon)}>
                                                                {discountCoupon.code} | Extra {discountCoupon.discount}%
                                                            </option>))) : (<></>)
                                                    }
                                                </select>
                                            </Form.Group>
                                            <Form.Group className="mb-3" name="addressId"

                                                        controlId="exampleForm.addressId">
                                                <Form.Label className={"me-3"}>Address</Form.Label>
                                                <select name="addressId"
                                                        value={addressId}
                                                        onChange={(e) => setAddressId(e.target.value)}
                                                >
                                                    <option value="">Select</option>
                                                    {addresses ? (
                                                        addresses.map(address => (
                                                            <option key={address.id} value={address.id}
                                                                    data-array={addresses.indexOf(address)}>
                                                                {address.address}, {address.region}...
                                                            </option>
                                                        ))
                                                    ) : (<></>)
                                                    }
                                                </select>
                                            </Form.Group>
                                            <Button variant="primary" className={"w-100"} size="lg"
                                                    onClick={handleSubmitOrder}>
                                                Send Order
                                            </Button>
                                        </Form>
                                    </div>
                                </div>
                            ) : (<>
                                <h4 className={""}>Please login before place an order</h4>
                            </>)
                        }

                    </Offcanvas.Body>
                </Offcanvas>
            </div>
            <div style={{
                position: 'absolute',
                top: 100,
                right: 30,
            }}>
                <Toast onClose={toggleShowToast} show={showToast} animation={true} delay={2500} autohide
                       className={"sticky-top"}>
                    <Toast.Header>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">Warning</strong>
                    </Toast.Header>
                    <Toast.Body>{message}</Toast.Body>
                </Toast>
            </div>
        </div>
    )
}

export default Homepage