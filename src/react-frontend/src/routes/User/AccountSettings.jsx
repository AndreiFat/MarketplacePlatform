import {useLocalState} from "../../Utilities/useLocalState.js";
import {useState} from "react";
import {jwtDecode} from "jwt-decode";
import {Breadcrumb, Card, Col, Form, InputGroup, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";

function AccountSettings() {
    const apiURL = import.meta.env.VITE_API_URL;
    const [validated, setValidated] = useState(false);
    const [jwt, setJwt] = useLocalState("", "jwt");

    const decodedToken = jwtDecode(jwt);
    const userEmail = decodedToken.sub;

    const userRole = decodedToken.authorities;
    const isAdmin = userRole.includes('ROLE_ADMIN');  //verific rolul userului din jwt

    const [user, setUser] = useState({
        name: "",
        surname: "",
        email: "",
        dateOfBirth: "",
        password: "",
        phoneNumber: "",
    });

    const labels = {
        name: "Name",
        surname: "Surname",
        email: "Email",
        dateOfBirth: "Birthday",
        password: "Password",
        phoneNumber: "Phone",
    }

    useState(() => {
        const userBody = {
            email: userEmail
        };

        fetch(`${apiURL}/users/viewUser`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: 'POST',
            body: JSON.stringify(userBody)
        }).then((response) => {
            console.log(response.status);
            return response.json();
        }).then((userData) => {
            setUser(userData);
        });
    });


    const {name, surname, email, dateOfBirth, phoneNumber, password} = user;

    const handleSubmit = (e) => {
        e.preventDefault();

        const userEdit = {
            name: name,
            surname: surname,
            email: email,
            dateOfBirth: dateOfBirth,
            password: password,
            phoneNumber: phoneNumber,
        }

        fetch(`${apiURL}/users/edit/${user.id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: 'PUT',
            body: JSON.stringify(userEdit),
        }).then((response) => response.json())
            .then((user) => {
                console.log(user);
            });
        window.location.reload();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }

        setValidated(true);
    };

    const handleLogout = () => {
        // Remove JWT token from local storage
        localStorage.removeItem('jwt');

        // Redirect the user to the login page
        window.location.href = '/login'; // Redirect to your login page
    };

    return (
        <>
            <Breadcrumb className={"mt-5"}>
                <Breadcrumb.Item href="/" className={"text-decoration-none"}>Store</Breadcrumb.Item>
                <Breadcrumb.Item active>Account Settings</Breadcrumb.Item>
            </Breadcrumb>
            <Row className={"justify-content-center pb-5"}>
                <h3 className={"text-center mb-4"}>Account Settings</h3>
                <Col md={4}>
                    <Card className={"p-2 rounded-4 border-0 shadow-sm"}>
                        <Card.Body>
                            <h3>User details</h3>
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <Form.Group as={Col} md="" className={"mb-3"}
                                            controlId={`validationCustom${labels.name}`}>
                                    <Form.Label>{labels.name}</Form.Label>
                                    <InputGroup hasValidation>
                                        <InputGroup.Text id="inputGroupPrepend">
                                            <FontAwesomeIcon icon={faUser}/>
                                        </InputGroup.Text>
                                        <Form.Control
                                            onChange={(e) => setUser({...user, name: e.target.value})}
                                            type="text"
                                            placeholder={labels.name}
                                            value={name}
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please choose a {labels.name}.
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group as={Col} md="" className={"mb-3"}
                                            controlId={`validationCustom${labels.surname}`}>
                                    <Form.Label>{labels.surname}</Form.Label>
                                    <InputGroup hasValidation>
                                        <InputGroup.Text id="inputGroupPrepend">
                                            <FontAwesomeIcon icon={faUser}/>
                                        </InputGroup.Text>
                                        <Form.Control
                                            onChange={(e) => setUser({...user, surname: e.target.value})}
                                            type="text"
                                            placeholder={labels.surname}
                                            value={surname}
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please choose a {labels.surname}.
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group as={Col} md="" className={"mb-3"}
                                            controlId={`validationCustom${labels.dateOfBirth}`}>
                                    <Form.Label>{labels.dateOfBirth}</Form.Label>
                                    <InputGroup hasValidation>
                                        <InputGroup.Text id="inputGroupPrepend">
                                            <FontAwesomeIcon icon={faUser}/>
                                        </InputGroup.Text>
                                        <Form.Control
                                            onChange={(e) => setUser({...user, dateOfBirth: e.target.value})}
                                            type="date"
                                            placeholder={labels.dateOfBirth}
                                            value={dateOfBirth}
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please choose a Date of {labels.dateOfBirth}.
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group as={Col} md="" className={"mb-3"}
                                            controlId={`validationCustom${labels.email}`}>
                                    <Form.Label>{labels.email}</Form.Label>
                                    <InputGroup hasValidation>
                                        <InputGroup.Text id="inputGroupPrepend">
                                            <FontAwesomeIcon icon={faUser}/>
                                        </InputGroup.Text>
                                        <Form.Control
                                            onChange={(e) => setUser({...user, email: e.target.value})}
                                            type="email"
                                            placeholder={labels.email}
                                            value={email}
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please choose a {labels.email}.
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group as={Col} md="" className={"mb-3"}
                                            controlId={`validationCustom${labels.password}`}>
                                    <Form.Label>{labels.password}</Form.Label>
                                    <InputGroup hasValidation>
                                        <InputGroup.Text id="inputGroupPrepend">
                                            <FontAwesomeIcon icon={faUser}/>
                                        </InputGroup.Text>
                                        <Form.Control
                                            onChange={(e) => setUser({...user, password: e.target.value})}
                                            type="password"
                                            placeholder={labels.password}
                                            value={password}
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please choose a {labels.password}.
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group as={Col} md="" className={"mb-3"}
                                            controlId={`validationCustom${labels.phoneNumber}`}>
                                    <Form.Label>{labels.phoneNumber}</Form.Label>
                                    <InputGroup hasValidation>
                                        <InputGroup.Text id="inputGroupPrepend">
                                            <FontAwesomeIcon icon={faUser}/>
                                        </InputGroup.Text>
                                        <Form.Control
                                            onChange={(e) => setUser({...user, phoneNumber: e.target.value})}
                                            type="phone"
                                            placeholder={labels.phoneNumber}
                                            value={phoneNumber}
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please choose a {labels.phoneNumber} Number.
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Button variant={"dark"} className={"w-100 py-2"} type="submit">Submit</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className={"p-2 rounded-4 border-0 shadow-sm mb-4"}>
                        <Card.Body>
                            <h4 className={"text-start mb-3"}>Manage Addresses</h4>
                            <Button variant={"dark"} className={"py-3 px-4 text-center rounded-4"}>
                                <Link to={"/addresses"} className={"text-decoration-none text-white"}>Manage
                                    Addresses</Link></Button>
                        </Card.Body>
                    </Card>
                    <Card className={"p-2 rounded-4 border-0 mb-4 shadow-sm"}>
                        <Card.Body>
                            <h4 className={"text-start mb-3"}>Manage Orders</h4>
                            <Button variant={"dark"} className={"py-3 px-4 text-center rounded-4"}>
                                <Link to={"/user/ManageOrders"}
                                      className={"text-decoration-none text-white"}>Orders</Link></Button>
                        </Card.Body>
                    </Card>
                    <Card className={"p-2 rounded-4 border-0 mb-4 shadow-sm"}>
                        <Card.Body>
                            <h4 className={"text-start mb-3"}>Admin Panel</h4>
                            <Button variant={"dark"} className={"py-3 px-4 text-center rounded-4"}>
                                <Link to={"/admin"}
                                      className={"text-decoration-none text-white"}>Go to Admin Panel</Link></Button>
                        </Card.Body>
                    </Card>
                    <Card className={"p-2 rounded-4 border-0 shadow-sm"}>
                        <Card.Body>
                            <h4 className={"text-start mb-3"}>Logout</h4>
                            <Button onClick={handleLogout} variant={"dark"}
                                    className={"py-3 px-4 text-center rounded-4"}>Logout
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default AccountSettings;