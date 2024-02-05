import {useLocalState} from "../../Utilities/useLocalState.js";
import {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {Col, Modal} from "react-bootstrap";
import Form from "react-bootstrap/Form";

function ManageAddresses() {

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
                const userFetch = await fetch(`http://localhost:8080/address/viewAddresses`, {
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

        fetch(`http://localhost:8080/address/addAddress`, {
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
        fetch(`http://localhost:8080/address/editAddress/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: 'PUT',
            body: JSON.stringify(addressBody),
        }).then((response) => response.json())
            .then((data) => {
                console.log(data);
                window.location.reload();
            });
        handleCloseEdit(id);
    }

    function handleDelete(id) {
        fetch(`http://localhost:8080/address/deleteAddress/${id}`, {
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
            <Button variant="primary" onClick={handleShow}>
                Add a new address
            </Button>
            {
                addresses ? (
                    addresses.map((address) => (
                        <div key={address.id}>
                            <span>{address.id} | </span>
                            <span>{address.address} | </span>
                            <span>{address.region} | </span>
                            <span>{address.country} | </span>
                            <span>
                                <Button variant="warning"
                                        onClick={() => handleShowEdit(address.id, address.address, address.region, address.country)}>
                                 Edit
                                </Button>
                            </span>
                            <span>
                                <Button variant="danger"
                                        onClick={() => handleDelete(address.id)}>
                                 Delete
                                </Button>
                            </span>
                        </div>
                    ))
                ) : (<></>)
            }

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

                                    <Button variant="secondary" onClick={() => handleCloseEdit(address.id)}>
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

                        <Button variant="secondary" onClick={handleClose}>
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