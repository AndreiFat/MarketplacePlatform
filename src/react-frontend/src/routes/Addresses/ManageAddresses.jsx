import {useLocalState} from "../../Utilities/useLocalState.js";
import {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {Breadcrumb, Card, Col, Modal, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";

function ManageAddresses() {
    const apiURL = import.meta.env.VITE_API_URL;

    const [jwt, setJwt] = useLocalState("", "jwt");
    const [addresses, setAddresses] = useState(null);

    const [address, setAddress] = useState("")
    const [region, setRegion] = useState("")
    const [country, setCountry] = useState("")

    const [addressEdit, setAddressEdit] = useState("")
    const [regionEdit, setRegionEdit] = useState("")
    const [countryEdit, setCountryEdit] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userFetch = await fetch(`${apiURL}/address/viewAddresses`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`
                    },
                    method: 'GET',
                });
                const addressesDetails = await userFetch.json();
                if (addressesDetails) {
                    console.log("adresele care vin " + addressesDetails.id);
                    setAddresses(addressesDetails);
                } else {
                    console.error('User details are null or undefined.');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, []);

    const [show, setShow] = useState(false);
    const [showModals, setShowModals] = useState({});

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true)

    const handleCloseEdit = (id) => {
        console.log("reset")
        setAddressEdit("");
        setRegionEdit("");
        setCountryEdit("");
        setShowModals((prevShowModals) => ({
            ...prevShowModals,
            [id]: false,
        }));
    };

    const handleShowEdit = (id, address, region, country) => {
        console.log("set")
        setAddressEdit(address);
        setRegionEdit(region);
        setCountryEdit(country);
        setShowModals((prevShowModals) => ({
            ...prevShowModals,
            [id]: true,
        }));
    };

    function handleOnSubmit() {
        const addressBody = {
            address: address,
            region: region,
            country: country,
        }

        fetch(`${apiURL}/address/addAddress`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: 'POST',
            body: JSON.stringify(addressBody),
        }).then((response) => response.json())
            .then((data) => {
                console.log(data);
                window.location.reload();
            });
    }

    function handleOnSubmitEdit(id) {
        const addressBody = {
            address: addressEdit,
            region: regionEdit,
            country: countryEdit,
        }
        console.log(addressBody, id)
        fetch(`${apiURL}/address/editAddress/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: 'PUT',
            body: JSON.stringify(addressBody),
        }).then((response) => response.json())
            .then((data) => {
                console.log(data);

            });
        handleCloseEdit(id);
        window.location.reload();
    }

    function handleDelete(id) {
        fetch(`${apiURL}/address/deleteAddress/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: 'DELETE',
        }).then((response) => {
            console.log(response.status)
            window.location.reload();
        })

    }

    return (
        <>
            <Breadcrumb className={"mt-5"}>
                <Breadcrumb.Item href="/" className={"text-decoration-none"}>Store</Breadcrumb.Item>
                <Breadcrumb.Item href="/accountSettings" className={"text-decoration-none"}>Account
                    Settings</Breadcrumb.Item>
                <Breadcrumb.Item active>Addresses</Breadcrumb.Item>
            </Breadcrumb>
            <Row className={"mb-3"}>
                <Col md={6}>
                    <h3>Addresses</h3>
                </Col>
                <Col className={"d-flex justify-content-end"} md={6}>
                    <Button variant="primary" onClick={handleShow}>
                        Add a new address
                    </Button>
                </Col>
            </Row>


            <Row>
                {
                    addresses ? (
                        addresses.map((address) => (

                            <Col md={4} key={address.id}>
                                <Card className={"p-2 rounded-4 border-0 shadow-sm"}>
                                    <Card.Body>
                                        <h5>{address.address}</h5>
                                        <h6 className={"text-muted"}>{address.region}, {address.country} </h6>
                                        <Row>
                                            <Col md={6}>
                                                <Button variant="warning" className={"w-100"}
                                                        onClick={() => handleShowEdit(address.id, address.address, address.region, address.country)}>
                                                    Edit
                                                </Button>
                                            </Col>
                                            <Col md={6}>
                                                <Button variant="danger" className={"w-100"}
                                                        onClick={() => handleDelete(address.id)}>
                                                    Delete
                                                </Button>
                                            </Col>
                                        </Row>
                                        <span>

                            </span>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (<></>)
                }
            </Row>

            {
                addresses ? (
                    addresses.map((address) => (
                        <Modal key={address.id} show={showModals[address.id] || false}
                               onHide={() => handleCloseEdit(address.id)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit address</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group as={Col} md="" className={"mb-3"} controlId="validationAddress">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            placeholder="Address"
                                            value={addressEdit}
                                            onChange={(e) => setAddressEdit(e.target.value)}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} md="" className={"mb-3"} controlId="validationRegion">
                                        <Form.Label>Region</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            placeholder="Region"
                                            value={regionEdit}
                                            onChange={(e) => setRegionEdit(e.target.value)}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} md="" className={"mb-3"} controlId="validationCountry">
                                        <Form.Label>Country</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            placeholder="Country"
                                            value={countryEdit}
                                            onChange={(e) => setCountryEdit(e.target.value)}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>

                                    <Button className={"me-3"} variant="secondary"
                                            onClick={() => handleCloseEdit(address.id)}>
                                        Close
                                    </Button>
                                    <Button variant="primary" type={"button"}
                                            onClick={() => handleOnSubmitEdit(address.id)}>
                                        Submit
                                    </Button>
                                </Form>
                            </Modal.Body>
                        </Modal>
                    ))
                ) : (<></>)
            }

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add an address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleOnSubmit}>
                        <Form.Group as={Col} md="" className={"mb-3"} controlId="validationAddress">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Address"
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="" className={"mb-3"} controlId="validationRegion">
                            <Form.Label>Region</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Region"
                                onChange={(e) => setRegion(e.target.value)}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="" className={"mb-3"} controlId="validationCountry">
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Country"
                                onChange={(e) => setCountry(e.target.value)}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>

                        <Button className={"me-3"} variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" type={"submit"} onClick={handleClose}>
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ManageAddresses