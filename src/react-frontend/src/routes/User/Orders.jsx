import {useLocalState} from "../../Utilities/useLocalState.js";
import {useEffect, useState} from "react";
import {Badge, ListGroup} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import jsPDF from "jspdf";

function Orders() {
    const [jwt, setJwt] = useLocalState("", "jwt");

    const [orders, setOrders] = useState(null)
    const [products, setProducts] = useState(null);
    const [order, setOrder] = useState(null)

    useEffect(() => {
        const fetchData = async () => {

            try {
                //First Fetch
                const orderFetch = await fetch('http://localhost:8080/orders/viewOrders', {
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
            //     const productFetch = await fetch('http://localhost:8080/products/viewProducts', {
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

        fetch('http://localhost:8080/orders/user/orderItems', {
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

    return (
        <>
            <div>
                <h3>Orders</h3>
                <ListGroup>
                    {
                        orders ? (
                            orders.map((order) => (
                                <ListGroup.Item className={"mb-3"} key={order.id}>
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
                                        Delivery time : {order.deliveryTime}</span>
                                    {
                                        order.status === "DONE" ? (
                                            <span className={"me-5"}>
                                                <Button onClick={() => downloadPDF(order)}>Download Invoice</Button>
                                            </span>
                                        ) : (<></>)
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

export default Orders