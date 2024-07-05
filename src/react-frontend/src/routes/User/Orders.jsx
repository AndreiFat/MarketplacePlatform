import {useLocalState} from "../../Utilities/useLocalState.js";
import {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import jsPDF from "jspdf";
import Accordion from "react-bootstrap/Accordion";
import {Col, Row, Spinner} from "react-bootstrap";
import truncateWords from "../../Utilities/truncateWords.js";
import OrderStatus from "../../components/OrderStatus.jsx";
import OrderStatusBadge from "../../components/OrderStatusBadge.jsx";
import CopyToClipboardButton from "../../components/CopyToClipboardButton.jsx";

function Orders() {
    const apiURL = import.meta.env.VITE_API_URL;
    const [jwt, setJwt] = useLocalState("", "jwt");

    const [orders, setOrders] = useState(null)
    const [products, setProducts] = useState(null);
    const [order, setOrder] = useState(null)

    const [loadingOrder, setLoadingOrder] = useState(false)
    const [productsFromOrder, setProductsFromOrder] = useState([])

    useEffect(() => {
        const fetchData = async () => {

            try {
                //First Fetch
                const orderFetch = await fetch(`${apiURL}/orders/viewOrders`, {
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
            // try {
            //     //First Fetch
            //     const productFetch = await fetch('${apiURL}/products/viewProducts', {
            //         headers: {
            //             "Content-Type": "application/json",
            //             // Authorization: `Bearer ${jwt}`,
            //         },
            //         method: 'GET',
            //
            //     });
            //     const productDetails = await productFetch.json();
            //     if (productDetails) {
            //         console.log(productDetails);
            //         setProducts(productDetails);
            //     } else {
            //         console.error('Product details are null or undefined.');
            //     }
            //
            // } catch (error) {
            //     console.error('Error:', error);
            // }
        }

        fetchData()
    }, []);

    const [loading, setLoading] = useState(false)

    const downloadPDF = (order) => {
        setLoading(true)

        fetch(`${apiURL}/orders/user/orderItems`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: 'POST',
            body: JSON.stringify(order.orderItems)
        }).then((response) => response.json())
            .then((data) => {
                setProducts(data)
                setLoading(false);
            });
        setOrder(order)
    };

    useEffect(() => {
        if (!loading && products !== null) {
            console.log("downloading")
            const doc = new jsPDF()
            doc.setFont('Helvetica', 'normal');

            // Add background color
            doc.setFillColor(240, 240, 240);
            doc.rect(0, 0, 210, 297, 'F');

            // Add company details
            doc.setFontSize(12);
            doc.text('MarketCup', 20, 25);
            doc.text('Baia Mare', 20, 35);
            doc.text('Maramures, Romania', 20, 45);
            doc.text('Phone: 123-456-7890', 20, 55);
            doc.text('Email: info@marketcup.com', 20, 65);

            // Add invoice details
            doc.setFontSize(18);
            doc.setFont('Helvetica', 'bold');
            doc.text('INVOICE', 125, 25);

            doc.setFontSize(12);
            doc.setFont('Helvetica', 'normal');
            doc.text('Invoice Number:', 100, 40);
            doc.text('Date:', 100, 50);
            doc.text('Customer Name:', 100, 60);
            doc.text('Email:', 100, 70);

            doc.setFont('Helvetica', 'bold');
            doc.text(`MCP${order.id}`, 150, 40);
            doc.text(`${order.deliveryTime}`, 150, 50);
            doc.text(`${order.userId.name} ${order.userId.surname}`, 150, 60);
            doc.text(`${order.userId.email}`, 150, 70);

            // Add table headers
            doc.setFont('Helvetica', 'bold');
            doc.setFillColor(100, 100, 100);
            doc.setTextColor(255, 255, 255);
            doc.rect(15, 90, 180, 10, 'F');

            doc.text('Product', 20, 97);
            doc.text('Price', 150, 97);

            doc.setFont('Helvetica', 'normal');
            doc.setFillColor(255, 255, 255);
            doc.setTextColor(0, 0, 0);

            let y = 97;
            // let yRect = 90;
            let yPrice = 97
            let total = 0

            products.map((product) => {
                // doc.rect(15, yRect = yRect + 10, 180, 10, 'F');
                doc.text(`${product.name}`, 20, y = y + 10);
                doc.text(`Ron ${product.price}`, 150, yPrice = yPrice + 10);
                total = total + product.price
            })

            // Calculate and add total

            doc.setFont('Helvetica', 'bold');
            doc.text(`Total: RON ${total.toFixed(2)}`, 150, 127);

            // Save the PDF as a blob
            const pdfBlob = doc.output('blob');

            // Create a URL for the blob
            const url = URL.createObjectURL(pdfBlob);

            // Create a link element
            const link = document.createElement('a');
            link.href = url;

            // Set the filename for the PDF
            link.download = 'invoice.pdf';

            // Append the link to the document body
            document.body.appendChild(link);

            // Trigger a click event on the link to initiate the download
            link.click();

            // Remove the link from the document body
            document.body.removeChild(link);
        }
    }, [loading, products, order]);


    const selectBadge = (orderStatus) => {
        switch (orderStatus) {
            case "PENDING":
                return <span className='p-2 color-pending badge fw-normal'>PENDING</span>
            case "DELIVERED":
                return <span className='p-2 color-delivery badge fw-normal'>DELIVERED</span>
            case "DONE":
                return <span className='p-2 color-done badge fw-normal'>DONE</span>
            case "ON DELIVERY":
                return <span className='p-2 color-orange badge fw-normal'>ON DELIVERY</span>
            case "CANCELED":
                return <span className='p-2 color-red badge fw-normal'>CANCELED</span>
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('default', {month: 'short'});
        const year = date.getFullYear();
        return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
    };

    const loadProductsOfOrder = (event, orderId, order) => {
        event.stopPropagation();
        setLoadingOrder(true)

        fetch(`${apiURL}/orders/user/orderItems`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: 'POST',
            body: JSON.stringify(order.orderItems)
        }).then((response) => response.json())
            .then((data) => {
                setTimeout(() => {
                    setProductsFromOrder(data)
                    setLoadingOrder(false)
                }, 500)

            });
    }

    return (
        <>
            <div className={"pt-3"}>
                <h3 className={"mb-3"}>Orders</h3>
                <Accordion defaultActiveKey="0">
                    {
                        orders ? (
                            orders.map((order) => (
                                <Accordion.Item className={""} eventKey={order.id.toString()}
                                                key={order.id}>
                                    <Accordion.Header
                                        onClick={(event) => loadProductsOfOrder(event, order.id, order)}>
                                        <div
                                            className={"d-flex justify-content-between align-items-center py-2 gap-3 pe-5"}>
                                            <h6 className={"mb-0"}>Order #{order.id}</h6>
                                            <span className={"me-5"}>
                                                <OrderStatusBadge
                                                    orderStatus={order.status}/>
                                            </span>
                                            {/*<p className={"mb-0"}>{order.price} RON</p>*/}
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <div className={"py-4"}>
                                            {loadingOrder ? (<>
                                                <div className="d-flex justify-content-center"><Spinner
                                                    animation="border" variant="success"/></div>
                                            </>) : (<>
                                                <Row>
                                                    <Col md={5}>
                                                        <h5>
                                                            Products in this order
                                                        </h5>
                                                        {productsFromOrder.length !== 0 ? (<>
                                                            {productsFromOrder.map((product) => (
                                                                <div key={product.id}
                                                                     className={"d-flex border-1 gap-4 border-bottom py-3 px-2 align-items-center"}>
                                                                    <div className={""}
                                                                         style={{
                                                                             backgroundImage: `url(data:image/jpeg;base64,${product.images[0].imageData})`,
                                                                             backgroundSize: 'cover',
                                                                             backgroundPosition: 'center',
                                                                             height: 48,
                                                                             width: 72,
                                                                             borderRadius: 6
                                                                         }}></div>
                                                                    <div>
                                                                        <div
                                                                            className="d-flex justify-content-between">
                                                                            <h6 className={"mb-1 fw-normal"}>{truncateWords(product.name, 6)} </h6>
                                                                            {product.price} RON
                                                                        </div>
                                                                        <p className="mb-0 fw-light text-muted fs-7">{truncateWords(product.description, 15)}</p>

                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </>) : (<></>)}
                                                    </Col>
                                                    <Col md={5}>
                                                        <h5>
                                                            Order Details
                                                        </h5>
                                                        <div className={"px-2 py-3"}>
                                                            <div className="d-flex justify-content-between">
                                                                <p className="fw-normal">Number</p>
                                                                <p className="fw-light text-muted">#{order.id}</p>
                                                            </div>
                                                            <div className="d-flex justify-content-between">
                                                                <p className="fw-normal">Tracking Number</p>
                                                                <p className="fw-light text-muted">{order.trackingNumber ?
                                                                    <CopyToClipboardButton
                                                                        text={order.trackingNumber}/> : "Not available"}</p>
                                                            </div>
                                                            <div className="d-flex justify-content-between">
                                                                <p className="fw-normal">Address</p>
                                                                <p className="fw-light text-muted">{order.addressId.address}, {order.addressId.region}</p>
                                                            </div>
                                                            <div className="d-flex justify-content-between">
                                                                <p className="fw-normal">Status</p>
                                                                <p className="fw-light text-muted"><OrderStatusBadge
                                                                    orderStatus={order.status}/></p>
                                                            </div>
                                                            <div
                                                                className="d-flex justify-content-between p-3 bg-green rounded-3">
                                                                <h4 className="fw-normal mb-0">Total</h4>
                                                                <div
                                                                    className="d-flex justify-content-end align-items-end gap-2">
                                                                    <h4 className="fw-normal mb-0">{order.price} RON </h4>
                                                                    <p className="fw-light text-muted mb-0">({order.quantity} Items)</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col md={2}>
                                                        <h5>
                                                            Timeline
                                                        </h5>
                                                        <div className="px-2 py-3">
                                                            <OrderStatus orderStatus={order.status}/>

                                                        </div>
                                                    </Col>
                                                </Row>
                                            </>)}
                                        </div>

                                        {
                                            order.status === "DONE" ? (
                                                <span className={"me-5"}>
                                                <Button onClick={() => downloadPDF(order)}>Download Invoice</Button>
                                            </span>
                                            ) : (<></>)
                                        }
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))
                        ) : (<></>)

                    }
                </Accordion>
            </div>
        </>
    )
}

export default Orders