import {useEffect, useState} from "react";
import {Badge, ListGroup} from "react-bootstrap";
import {useLocalState} from "../Utilities/useLocalState.js";
import Button from "react-bootstrap/Button";

function ManageOrders() {
    const [jwt, setJwt] = useLocalState("", "jwt");

    const [orders, setOrders] = useState(null)
    useEffect(() => {
        const fetchData = async () => {

            try {
                //First Fetch
                const orderFetch = await fetch('http://localhost:8080/orders/admin/viewOrders', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                    method: 'GET',

                });
                const orderDetails = await orderFetch.json();
                if (orderDetails) {
                    console.log(orderDetails);
                    setOrders(orderDetails);
                } else {
                    console.error('Product details are null or undefined.');
                }

            } catch (error) {
                console.error('Error:', error);
            }
        }
        fetchData()
    }, []);

    function handleMarkDone(id) {
        const status = {
            status: "DONE"
        };
        fetch(`http://localhost:8080/orders/editOrderStatus/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: 'PUT',
            body: JSON.stringify(status)
        }).then((response) => {
            console.log(response.status)
        });
    }

    return (
        <>
            <div>
                <h3>Orders</h3>
                <ListGroup>
                    {
                        orders ? (
                            orders.map((order) => (
                                <ListGroup.Item key={order.id} className={"mb-3"}>
                                <span className={"me-5"}>
                                    {order.id}
                                </span>

                                    <span className={"me-5"}>
                                    Quantity: {order.quantity}
                                </span>
                                    <span className={"me-5"}>
                                    Price: {order.price} Ron
                                </span>
                                    <span className={"me-5"}>
                                        {
                                            order.status === "PENDING" ? (
                                                <Badge className={"p-2"} bg="primary">{order.status}</Badge>
                                            ) : (
                                                <Badge className={"p-2"} bg="success">{order.status}</Badge>
                                            )
                                        }
                                </span>
                                    <span className={"me-5"}>
                                        {
                                            order.discountId === null ? (
                                                <span>Discount : No</span>
                                            ) : (
                                                <span> Discount : Yes</span>
                                            )
                                        }
                                </span>

                                    <span className={"me-5"}>
                                  Delivery time : {order.deliveryTime}
                                </span>
                                    {
                                        order.status === "DONE" ? (
                                            <span className={"me-5"}>
                                    <Button variant={"secondary"} disabled={true}>Mark Done</Button>
                                </span>
                                        ) : (
                                            <span className={"me-5"}>
                                    <Button onClick={() => handleMarkDone(order.id)}>Mark Done</Button>
                                </span>
                                        )
                                    }
                                </ListGroup.Item>
                            ))
                        ) : (<></>)

                    }

                </ListGroup>
            </div>
        </>
    )
}

export default ManageOrders