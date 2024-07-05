import {useEffect, useState} from "react";
import {Form, ListGroup} from "react-bootstrap";
import {useLocalState} from "../Utilities/useLocalState.js";

function ManageOrders() {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [statusName, setStatusName] = useState(null);
    const [currentStatusId, setCurrentStatusId] = useState(null);

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
        switch (orderStatus) {
            case status[0]:
                return <option key={0} value="0" defaultValue>{status[0]}</option>
            case status[1]:
                return <option key={1} value="1" defaultValue>{status[1]}</option>
            case status[2]:
                return <option key={2} value="2" defaultValue>{status[2]}</option>
            case status[3]:
                return <option key={3} value="3" defaultValue>{status[3]}</option>
            case status[4]:
                return <option key={4} value="4" defaultValue>{status[4]}</option>
            default:
                return <option key={null} value="default" defaultValue>Select Status</option>
        }
    }
    const status = ["PENDING", "DELIVERED", "DONE", "ON DELIVERY", "CANCELED"];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('default', {month: 'short'});
        const year = date.getFullYear();
        return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
    };

    const handleStatusUpdate = async (selectedStatusId, id, order) => {
        const selectedStatus = status[selectedStatusId];
        const timestamp = new Date().toISOString();


        // Create a new status update object
        const statusUpdate = {
            status: selectedStatus,
            timestamp: timestamp
        };
        try {
            // Parse the current status history JSON string from order.status
            const currentStatusHistory = JSON.parse(order.status).statusHistory;

            // Check if the selected status already exists in statusHistory
            const statusExists = currentStatusHistory.some(entry => entry.status === selectedStatus);

            if (statusExists) {
                console.log('Status already exists:', selectedStatus);
                return; // Exit function if status already exists
            }

            // Append new status update to current status history
            const updatedStatusHistory = [...currentStatusHistory, statusUpdate];

            // Prepare updated status JSON
            const updatedStatusJson = JSON.stringify({statusHistory: updatedStatusHistory});

            // Update order status in backend
            const response = await fetch(`http://localhost:8080/orders/editOrderStatus/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                method: 'PUT',
                body: updatedStatusJson
            });

            if (response.ok) {
                console.log('Status updated successfully:', statusUpdate);

                // Optionally update orders list or other UI components
            } else {
                console.error('Failed to update status:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }

    const handleChange = (e, orderId, order) => {
        const selectedStatusId = parseInt(e.target.value, 10);
        setCurrentStatusId(selectedStatusId);
        handleStatusUpdate(selectedStatusId, orderId, order);
    };

    return (
        <>
            <div>
                <h3>Orders</h3>
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
                                        {
                                            selectBadge(order.status)
                                        }
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
                                    <Form className={"w-25"} key={`form-${order.id}`}>
                                        <Form.Select
                                            aria-label="Select Status"
                                            size="sm"
                                            name="status"
                                            key={order.id}
                                            value={status.indexOf(order.status)}
                                            onChange={(e) => handleChange(e, order.id, order)}
                                        >
                                            {selectStatus(order.status)}
                                            {status.map((item, index) => (
                                                order.status !== item ? (
                                                    <option key={item}
                                                            value={index}>{item}</option>
                                                ) : (<></>)
                                            ))}
                                        </Form.Select>
                                    </Form>
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