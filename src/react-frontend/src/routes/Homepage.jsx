import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import {faCartShopping, faHeart} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useLocalState} from "../Utilities/useLocalState.js";
import {jwtDecode} from 'jwt-decode';
import {Offcanvas} from "react-bootstrap";
import Cookies from 'js-cookie';
import Form from "react-bootstrap/Form";

function Homepage() {

    const [show, setShow] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const navigate = useNavigate();
    const [jwt, setJwt] = useLocalState("", "jwt");

    const decodedToken = jwtDecode(jwt);
    const userRole = decodedToken.authorities;
    const isAdmin = userRole.includes('ROLE_ADMIN');
    const userEmail = decodedToken.sub;

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
                    console.error('Product details are null or undefined.');
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

    function saveAsFavourite(productId) {
        const favouriteProduct = {
            productId: {
                id: productId
            },
            // userId: {
            //     id: 2
            // }
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
        console.log(productId)
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

    return (
        <div className="container justify-content-center">
            {
                products ? (
                        products.map((product) => (
                            <div key={product.id}>
                                <Link to={`${product.id}`}><span>{product.id}</span></Link>
                                <span>{product.name}</span>
                                <span>{product.price}</span>
                                {product.images[0] ?
                                    (<img height="100px" width="100px" key={product.images[0].id}
                                          src={`data:image/jpeg;base64,${product.images[0].imageData}`}
                                          alt={product.images[0].name}/>) : <></>
                                }
                                {/*ALL IMAGES*/}
                                {/*{*/}
                                {/*    product.images ? (*/}
                                {/*        product.images.map((image) => (*/}
                                {/*            <img height="100px" width="100px" key={image.id}*/}
                                {/*                 src={`data:image/jpeg;base64,${image.imageData}`}*/}
                                {/*                 alt={image.name}/>*/}
                                {/*        ))*/}

                                {/*    ) : <></>*/}
                                {/*}*/}
                                <span><Button variant="warning"><Link
                                    to={`/editProducts/${product.id}`}>Edit</Link></Button></span>
                                <span><Button variant="danger"
                                              onClick={() => deleteProduct(product.id)}>Delete</Button></span>
                                <span><Button variant="primary"
                                              onClick={() => saveAsFavourite(product.id)}><FontAwesomeIcon
                                    icon={faHeart}
                                    size={"xl"}/></Button></span>
                                <span> <Button
                                    onClick={() => addToCart(product.id, product.price)}>Add to Cart</Button></span>
                            </div>
                        )))
                    : (<></>)}
            <Button variant="light"><Link to={'/addingProducts'}>Add a product</Link></Button>
            {isAdmin && <Button variant="light"><Link to={'/manageCategories'}>Categories</Link></Button>}
            {isAdmin && <Button variant="light"><Link to={'/manageDiscountCoupons'}>DiscountCoupons</Link></Button>}

            <div id="shopping-cart">
                <Button onClick={handleShow}
                    // onClick={openCart}
                        style={{width: "3rem", height: "3rem"}}
                        variant="primary"
                        className="rounded-circle floating-element"
                >
                    <FontAwesomeIcon icon={faCartShopping} size={"lg"}/>
                    <div
                        className="rounded-circle bg-danger d-flex justify-content-center align-items-center"
                        style={{
                            color: "white",
                            width: "1.5rem",
                            height: "1.5rem",
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
                        <Offcanvas.Title>Offcanvas</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <h3>Products in Cart:</h3>
                        <ul>
                            {productsInOrder.map(product => (
                                <li key={product.id}>
                                    {product.name} - Quantity: {product.quantity}
                                    <Button className={"btn btn-primary"}
                                            onClick={() => removeItemFromCart(product.id)}>Delete</Button>
                                </li>
                            ))}
                        </ul>
                        <div className="offcanvas-footer d-block">
                            <Form>
                                <h3><b>Price</b> : {order.price} RON</h3>
                                {couponId && verifyCategory() ? (
                                    <div>
                                        <h5><b>Discount</b> : {calculateDiscountedPrice()} RON</h5>
                                        <h5><b>Total Price</b> : {priceAfterDiscount()} RON</h5>
                                    </div>
                                ) : (<></>)}
                                <Form.Group className="mb-3" name="couponId"

                                            controlId="exampleForm.couponId">
                                    <Form.Label>Discount Coupons</Form.Label>
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
                                    <Form.Label>Address</Form.Label>
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
                                <Button variant="primary" className={"w-100"} size="lg" onClick={handleSubmitOrder}>
                                    Send Order
                                </Button>
                            </Form>
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>
            </div>
        </div>
    )
}

export default Homepage