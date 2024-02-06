import {Card, Col, Form, InputGroup, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCakeCandles, faEnvelope, faLock, faPhone, faUser} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

function Register() {

    const [validated, setValidated] = useState(false);
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [email, setEmail] = useState("")
    const [dateOfBirth, setDateOfBirth] = useState(new Date())
    const [password, setPassword] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")

    const labels = {
        name: "Name",
        surname: "Surname",
        email: "Email",
        dateOfBirth: "Birthday",
        password: "Password",
        phoneNumber: "Phone",
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        const user = {
            name,
            surname,
            email,
            dateOfBirth,
            password,
            phoneNumber,
        }

        fetch('http://localhost:8080/api/auth/register', {
            headers: {
                "Content-Type": "application/json",
            },
            method: 'POST',
            body: JSON.stringify(user),
        }).then((response) => response.json())
            .then((user) => {
                console.log(user);
            });

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    };

    return (
        <>
            <Row className={"justify-content-center pt-4"}>
                <Col md={5}>
                    <Card className={"p-2 rounded-4 border-0 shadow-sm"}>
                        <Card.Body>
                            <h3 className={"mb-3"}>Register</h3>
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <Form.Group as={Col} md="" className={"mb-3"}
                                            controlId={`validationCustom${labels.name}`}>
                                    <Form.Label>{labels.name}</Form.Label>
                                    <InputGroup hasValidation>
                                        <InputGroup.Text id="inputGroupPrepend">
                                            <FontAwesomeIcon icon={faUser}/>
                                        </InputGroup.Text>
                                        <Form.Control
                                            onChange={(e) => setName(e.target.value)}
                                            type="text"
                                            placeholder={labels.name}
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
                                            onChange={(e) => setSurname(e.target.value)}
                                            type="text"
                                            placeholder={labels.surname}
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
                                            <FontAwesomeIcon icon={faCakeCandles}/>
                                        </InputGroup.Text>
                                        <Form.Control
                                            onChange={(e) => setDateOfBirth(e.target.value)}
                                            type="date"
                                            placeholder={labels.dateOfBirth}
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
                                            <FontAwesomeIcon icon={faEnvelope}/>
                                        </InputGroup.Text>
                                        <Form.Control
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="email"
                                            placeholder={labels.email}
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
                                            <FontAwesomeIcon icon={faLock}/>
                                        </InputGroup.Text>
                                        <Form.Control
                                            onChange={(e) => setPassword(e.target.value)}
                                            type="password"
                                            placeholder={labels.password}
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
                                            <FontAwesomeIcon icon={faPhone}/>
                                        </InputGroup.Text>
                                        <Form.Control
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            type="phone"
                                            placeholder={labels.phoneNumber}
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please choose a {labels.phoneNumber} Number.
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                                <p className={"mb-0 mb-3"}>Already have an account? <Link
                                    className={"text-dark fw-semibold"} to={"/register"}>Log in.
                                </Link></p>
                                <Button variant={"dark"} className={"w-100 py-2"} type="submit">Submit</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default Register