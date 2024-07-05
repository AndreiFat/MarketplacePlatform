import React, {useState} from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {useLocalState} from "../../Utilities/useLocalState.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStripe} from "@fortawesome/free-brands-svg-icons";
import {Toast} from "react-bootstrap";
import Button from "react-bootstrap/Button";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_KEY);

const CheckoutButton = ({products, order, addressId, priceAfterDiscount, couponId}) => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const apiURL = import.meta.env.VITE_API_URL;

    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    const toggleShowToast = () => setShowToast(!showToast);

    const handleClick = async () => {
        const stripe = await stripePromise;

        const orderBody = {...order};
        if (addressId !== '') {
            orderBody.address.id = addressId;
            orderBody.price = priceAfterDiscount();
            orderBody.discount.id = couponId;

            // Add the order to the server and get the order ID
            const orderResponse = await fetch(`${apiURL}/orders/addOrder`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`
                },
                method: 'POST',
                body: JSON.stringify(orderBody)
            });
            const savedOrder = await orderResponse.json();
            const orderId = savedOrder.id; // Assuming the response contains the order ID

            // Send the updated products array to create a checkout session
            const response = await fetch(`${apiURL}/create-checkout-session`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`
                },
                body: JSON.stringify({products: products, orderId: orderId}), // Include orderId here
            });
            const session = await response.json();
            const result = await stripe.redirectToCheckout({
                sessionId: session.id,
            });

            if (result.error) {
                console.error(result.error.message);
            }

        } else {
            setMessage("Address not selected!");
            toggleShowToast();
        }
    };

    return (
        <>
            <Button onClick={handleClick}
                    className="btn btn-primary w-100 py-2 stripe-color d-flex justify-content-center align-items-center rounded-4">
                Checkout via <FontAwesomeIcon className="ms-2 py-1" icon={faStripe} size="2xl" type="button"/>
            </Button>
            <div style={{
                position: 'absolute',
                top: "-620px",
                left: "-32%",
                transform: `translate(-50%, 0)`,
                zIndex: 12
            }}>
                <Toast onClose={toggleShowToast} show={showToast} animation={true} delay={3500} autohide
                       className="sticky-top">
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
        </>
    );
};

export default CheckoutButton;
