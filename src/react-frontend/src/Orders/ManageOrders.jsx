import {useEffect, useState} from "react";
import {Form, ListGroup} from "react-bootstrap";
import {useLocalState} from "../Utilities/useLocalState.js";
import OrderStatusBadge from "../components/OrderStatusBadge.jsx";
import StatusSelect from "../components/StatusSelect.jsx";
import BackButton from "../components/BackButton.jsx";

function ManageOrders() {
    const apiURL = import.meta.env.VITE_API_URL;
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [statusName, setStatusName] = useState(null);

    const [orders, setOrders] = useState(null)
    useEffect(() => {
        const fetchData = async () => {

            try {
                //First Fetch
                const orderFetch = await fetch(`${apiURL}/orders/admin/viewOrders`, {
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
        fetch(`${apiURL}/orders/editOrderStatus/${id}`, {
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

    const selectBadge = (orderStatus) => {
        switch (orderStatus) {
            case status[0]:
                return <span className='p-2 color-pending badge fw-normal'>PENDING</span>
            case status[1]:
                return <span className='p-2 color-delivery badge fw-normal'>DELIVERED</span>
            case status[2]:
                return <span className='p-2 color-done badge fw-normal'>DONE</span>
            case status[3]:
                return <span className='p-2 color-orange badge fw-normal'>ON DELIVERY</span>
            case status[4]:
                return <span className='p-2 color-red badge fw-normal'>CANCELED</span>
        }
    }

    const selectStatus = (orderStatus) => {
        console.log(orderStatus)
        switch (orderStatus) {
            case status[0]:
                return <option key={0} value="0" defaultValue>{status[0]}</option>
            case status[1]:
                return <option key={1} value="1" defaultValue>{status[1]}</option>
            case status[2]:
                return <option key={2} value="2" defaultValue>{status[2]}</option>
            case status[3]:
                return <option key={3} value="3" defaultValue>{status[3]}</option>
            default:
                return <option key={null} value="default" defaultValue>Select Status</option>
        }
    }
    const status = ["PENDING", "ON DELIVERY", "DELIVERED", "DONE"];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('default', {month: 'short'});
        const year = date.getFullYear();
        return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
    };

    const getLatestStatus = (orderStatus) => {
        const statusObject = JSON.parse(orderStatus);
        const {statusHistory} = statusObject;
        return statusHistory.sort((a, b) => b.timestamp - a.timestamp)[0];
    };

    return (
        <>
            <div>
                <div className="d-flex gap-3 align-items-center mb-3">
                    <BackButton>
                    </BackButton>
                    <h3 className={"mb-0"}>Orders</h3>
                </div>
                <ListGroup>
                    {
                        orders ? (
                            orders.map((order) => (
                                <ListGroup.Item key={order.id}
                                                className={"mb-2 rounded-3 py-3 d-flex justify-content-between align-items-center"}>
                                <span>
                                    #{order.id}
                                </span>

                                    <span>
                                    Quantity: {order.quantity}
                                </span>
                                    <span>
                                    Price: {order.price} Ron
                                </span>
                                    <span>
                                        <OrderStatusBadge orderStatus={order.status}/>
                                </span>
                                    <span>
                                        {
                                            order.discountId === null ? (
                                                <span>Discount : No</span>
                                            ) : (
                                                <span> Discount : Yes</span>
                                            )
                                        }
                                </span>

                                    <span>
                                      Delivery time : {formatDate(order.deliveryTime)}
                                    </span>
                                    {
                                        getLatestStatus(order.status).status !== "CANCELED" ? (
                                            <Form className={"w-25"} key={`form-${order.id}`}>
                                                {<StatusSelect order={order} status={status}/>}
                                            </Form>) : (<>
                                            <Form className={"w-25"} key={`form-${order.id}`}>
                                                <Form.Select
                                                    aria-label="Select Status"
                                                    size="sm"
                                                    name="status"
                                                    key={order.id}
                                                    disabled={true}>
                                                    <option value="default">Order canceled by client</option>
                                                </Form.Select>
                                            </Form>
                                        </>)
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