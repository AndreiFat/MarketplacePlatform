import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import {faCartShopping, faTrash, faWallet} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useLocalState} from "../Utilities/useLocalState.js";
import {Card, Offcanvas, Row, Toast} from "react-bootstrap";
import Cookies from 'js-cookie';
import Form from "react-bootstrap/Form";
import Product from "../components/Product.jsx";
import HomePageCarousel from "../components/Carousel.jsx";
import {jwtDecode} from "jwt-decode";
import CheckoutButton from "../Orders/Payment/CheckoutButton.jsx";
import truncateWords from "../Utilities/truncateWords.js";
import CategoriesSidebar from "../components/CategoriesSidebar.jsx";

function Homepage() {
    const apiURL = import.meta.env.VITE_API_URL;
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
    const [productsInPayment, setProductsInPayment] = useState([]);

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

    const getProductsInOrderForPayment = () => {
        if (!products || !order.productIds) {
            // Handle the case when products or order.productIds is not available
            return [];
        }

        return order.productIds.map(orderItem => {
            const product = products.find(product => product.id === orderItem.id);
            if (product) {
                return {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    quantity: orderItem.quantity,
                    price: product.price,
                    images: product.images // Assuming images is an array of image objects
                };
            }
            return null;
        }).filter(product => product !== null);
    };

    useEffect(() => {
        const updatedProductsInOrder = getProductsInOrder();
        const productToPayment = getProductsInOrderForPayment();
        console.log('Updated Products in Order:', updatedProductsInOrder);
        setProductsInOrder(updatedProductsInOrder);
        setProductsInPayment(productToPayment)
    }, [order, products]); // Include products in the dependencies

    const [addresses, setAddresses] = useState(null);
    const [addressId, setAddressId] = useState("")
    const [discountCoupons, setDiscountCoupons] = useState(null);
    const [couponId, setCouponId] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const addressesFetch = await fetch(`${apiURL}/address/viewAddresses`, {
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
        fetch(`${apiURL}/discountCoupons/viewCoupons`, {
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


    const [discountValue, setDiscountValue] = useState(0);

    useEffect(() => {
        // Calculate discount when the selected coupon changes
        if (couponId !== "") {
            const coupon = discountCoupons.find(coupon => {
                return String(coupon.categoryId.id) === couponId
            });
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
        return productsInOrder.find((product) => {
            return String(product.categoryId.id) === couponId
        })
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

    const handlePaymentSubmit = () => {
        const orderBody = {...order}
        if (addressId !== '') {
            orderBody.address.id = addressId
            orderBody.price = priceAfterDiscount();
            orderBody.discount.id = couponId
            console.log(orderBody)

            fetch(`${apiURL}/orders/addOrder`, {
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
        } else {
            setMessage("Address not selected!")
            toggleShowToast()
        }
    }

    useEffect(() => {
        fetch(`${apiURL}/categories/categories-with-products`, {
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
            <div className="d-flex mb-4">
                <CategoriesSidebar categories={categories}></CategoriesSidebar>
                <HomePageCarousel></HomePageCarousel>
            </div>
            <Row className={""}>
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
                                    <div className={" cart-height"} id={"product-cart-list"}>
                                        <div>
                                            {productsInOrder.length !== 0 ? (
                                                productsInOrder.map(product => (
                                                    <Card key={product.id}
                                                          className={"my-3 rounded-4 border-secondary-subtle"}>
                                                        <Card.Body className={"p-3"}>
                                                            <div
                                                                className={"d-flex justify-content-between align-items-center"}>
                                                                <div className={"d-flex gap-3 align-items-center"}>
                                                                    <div
                                                                        style={{
                                                                            backgroundImage: `url(data:image/jpeg;base64,${product.images[0].imageData})`,
                                                                            backgroundSize: 'cover',
                                                                            backgroundPosition: 'center',
                                                                            height: 60,
                                                                            width: 86,
                                                                            borderRadius: 6
                                                                        }}>

                                                                    </div>
                                                                    <div>
                                                                        <h6 className={"mb-1"}>{truncateWords(product.name, 5)}</h6>
                                                                        <div className={"d-flex gap-2"}>
                                                                        <span
                                                                            className={"fs-6 mb-0 text-muted"}>QTY: {product.quantity}</span>
                                                                            <span>|</span>
                                                                            <span
                                                                                className={"fs-6 mb-0 text-muted"}>{product.priceAfterDiscount ? product.priceAfterDiscount : product.price} Ron</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className={"d-flex flex-column align-items-end"}>
                                                                    <div className={"d-flex gap-2"}>
                                                                        {/*<div style={{*/}
                                                                        {/*    width: 32,*/}
                                                                        {/*    height: 32,*/}
                                                                        {/*    borderRadius: 100*/}
                                                                        {/*}}*/}
                                                                        {/*     className={"bg-secondary-subtle d-flex align-items-center justify-content-center"}>*/}
                                                                        {/*    <Button*/}
                                                                        {/*        className={"bg-transparent border-0 text-secondary"}*/}
                                                                        {/*        onClick={() => removeItemFromCart(product.id)}><FontAwesomeIcon*/}
                                                                        {/*        icon={faPlus}/></Button>*/}
                                                                        {/*</div>*/}
                                                                        {/*<div style={{*/}
                                                                        {/*    width: 32,*/}
                                                                        {/*    height: 32,*/}
                                                                        {/*    borderRadius: 100*/}
                                                                        {/*}}*/}
                                                                        {/*     className={"bg-secondary-subtle d-flex align-items-center justify-content-center"}>*/}
                                                                        {/*    <Button*/}
                                                                        {/*        className={"bg-transparent border-0 text-secondary"}*/}
                                                                        {/*        onClick={() => removeItemFromCart(product.id)}><FontAwesomeIcon*/}
                                                                        {/*        icon={faMinus}/></Button>*/}
                                                                        {/*</div>*/}
                                                                        <div style={{
                                                                            width: 32,
                                                                            height: 32,
                                                                            borderRadius: 100
                                                                        }}
                                                                             className={"bg-danger d-flex align-items-center justify-content-center"}>
                                                                            <Button
                                                                                className={"bg-transparent border-0"}
                                                                                onClick={() => removeItemFromCart(product.id)}><FontAwesomeIcon
                                                                                icon={faTrash}/></Button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                ))) : (<>
                                                <div>
                                                    <div className={"d-flex justify-content-center py-5 mt-5"}>
                                                        <img src="/src/assets/empty-cart.svg" alt="" height={"150"}/>
                                                    </div>
                                                    <h6 className={"text-center text-muted fs-6 mb-1"}>Cart is
                                                        empty</h6>
                                                    <p
                                                        className={"text-center text-black-50 fs-6"}>Return to
                                                        the store
                                                        and
                                                        choose your favorite products.</p>

                                                </div>
                                            </>)}
                                        </div>
                                        <div id="spacer" className={"flex-grow-1"}></div>
                                    </div>

                                </div>
                            ) : (<>
                                <h4 className={""}>Please login before place an order</h4>
                            </>)
                        }
                    </Offcanvas.Body>
                    {loggedIn ? (
                        productsInOrder.length !== 0 ? (
                            <div className="offcanvas-footer bg-white w-100 p-4 shadow">
                                <Form>
                                    <Form.Group className="my-3" name="couponId" controlId="exampleForm.couponId">
                                        <Form.Label className={"me-3"}>Discount Coupons</Form.Label>
                                        <Form.Select aria-label="Default select example" name="couponId"
                                                     value={couponId}
                                                     onChange={(e) => setCouponId(e.target.value)}>
                                            <option value="">Select</option>

                                            {discountCoupons ?
                                                (discountCoupons.map(discountCoupon => (
                                                    <option key={discountCoupon.id}
                                                            value={discountCoupon.categoryId.id}
                                                            data-array={discountCoupons.indexOf(discountCoupon)}>
                                                        {discountCoupon.code} |
                                                        Extra {discountCoupon.discount}%
                                                    </option>))) : (<></>)
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3" name="addressId" controlId="exampleForm.addressId">
                                        <Form.Label className={"me-3"}>Address</Form.Label>
                                        <Form.Select aria-label="Default select example" name="addressId"
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
                                        </Form.Select>
                                    </Form.Group>
                                    <div className={"py-3 border-secondary-subtle border-top"}>
                                        {couponId && verifyCategory() ? (<>
                                                <div
                                                    className={"d-flex justify-content-between align-items-center text-muted"}>
                                                    <span>Price</span>
                                                    <span>{order.price} RON</span>
                                                </div>
                                                <div
                                                    className={"d-flex justify-content-between align-items-center text-muted"}>
                                                    <span>Discount</span>
                                                    <span>{calculateDiscountedPrice()} RON</span>
                                                </div>
                                                <div
                                                    className={"d-flex justify-content-between align-items-center mt-2"}>
                                                    <span className={"fs-5 font-semibold"}>Total Price</span>
                                                    <span
                                                        className={"fs-5 font-semibold"}>{priceAfterDiscount()} RON</span>
                                                </div>
                                            </>
                                        ) : (<>
                                            <div className={"d-flex justify-content-between align-items-center"}>
                                                <span className={"fs-5 font-semibold"}>Price</span>
                                                <span className={"fs-5 font-semibold"}>{order.price} RON</span>
                                            </div>
                                        </>)}
                                    </div>
                                    <div className="d-flex justify-content-between gap-2 align-items-center">
                                        <CheckoutButton products={productsInPayment} order={order}
                                                        priceAfterDiscount={priceAfterDiscount}
                                                        addressId={addressId} couponId={couponId}/>
                                        <div className={"text-center text-muted"}>OR</div>
                                        <button onClick={handlePaymentSubmit}
                                                className={"btn btn-dark py-3 rounded-4 w-100"}
                                                type={"button"}>
                                            Pay on Delivery <FontAwesomeIcon icon={faWallet} size={"lg"}
                                                                             className={"ms-2"}/>
                                        </button>
                                    </div>
                                </Form>
                            </div>) : (<></>)) : (<></>)}
                </Offcanvas>
            </div>
            <div style={{
                position: 'absolute',
                top: "150px",
                right: "50%",
                transform: `translate(50%, -50%)`,
                zIndex: 100
            }}>
                <Toast onClose={toggleShowToast} show={showToast} animation={true} delay={3500} autohide
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