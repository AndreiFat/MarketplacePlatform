import {useEffect} from "react";
import {Link, useLocation} from "react-router-dom";
import {useLocalState} from "../../Utilities/useLocalState.js";
import Cookies from "js-cookie";
import Button from "react-bootstrap/Button";

function ManagePayment() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('session_id');
    const orderId = searchParams.get('order_id');
    const [jwt, setJwt] = useLocalState("", "jwt");

    console.log(orderId)

    useEffect(() => {
        if (sessionId) {
            fetch(`http://localhost:8080/confirm-and-update?session_id=${sessionId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`
                },
                method: 'POST',
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Payment confirmation failed');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data)
                    Cookies.remove('order');
                })
                .catch(error => {
                    console.error('Error:', error.message);
                });
        }
    }, [sessionId]);

    return (
        <>
            <div className={"success-container d-flex justify-content-center align-items-center"}>
                <div>
                    <div className={"d-flex justify-content-center mb-3"}>
                        <img src="/src/assets/successful-payment.svg" alt="" height={"300px"}/>
                    </div>
                    <h3 className={"text-center"}>Thank you for your order!</h3>
                    <div className="d-flex justify-content-center py-3">
                        <p className={"text-center text-muted w-75"}>We are happy to be part of your green environment!
                            We
                            will
                            be
                            back
                            soon with
                            information about your
                            order.</p>
                    </div>
                    <div className="d-flex gap-3 justify-content-center">
                        <Button className={" btn-secondary py-3 px-4 rounded-pill"}>
                            <Link to={"/"} className={"text-decoration-none text-white"}>
                                Back to Homepage
                            </Link>
                        </Button>
                        <Button className={" btn-dark py-3 px-4 rounded-pill"}>
                            <Link to={"/user/ManageOrders"} className={"text-decoration-none text-white"}>
                                View your orders
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>

    )
}

export default ManagePayment