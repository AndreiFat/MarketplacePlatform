import {Card, Col, Form, InputGroup, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLock, faUser} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import Button from "react-bootstrap/Button";
import {useLocalState} from "../../Utilities/useLocalState.js";
import {Link} from "react-router-dom";

function Login() {
    const [validated, setValidated] = useState(false);
    const [jwt, setJwt] = useLocalState("", "jwt");

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const labels = {
        email: "Email",
        password: "Password",
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        const user = {
            email,
            password,
        }

        fetch('http://localhost:8080/api/auth/login', {
            headers: {
                "Content-Type": "application/json",
            },
            method: 'POST',
            body: JSON.stringify(user),
        })
            .then((response) => {
                if (response.status === 200) {
                    return Promise.all([response.json(), response.headers]);
                } else {
                    return Promise.reject("Invalid Login");
                }
            })
            .then(([body, headers]) => {
                setJwt(headers.get("authorization"));
                window.location.href = "/";
            })
            .catch((message) => {
                alert(message);
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
            <Row className={"justify-content-center py-5"}>
                <Col md={5}>
                    <Card className={"p-2 rounded-4 border-0 shadow-sm"}>
                        <Card.Body>
                            <h3 className={"mb-3"}>Login</h3>
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <Form.Group as={Col} md="" className={"mb-3"}
                                            controlId={`validationCustom${labels.email}`}>
                                    <Form.Label>{labels.email}</Form.Label>
                                    <InputGroup hasValidation>
                                        <InputGroup.Text id="inputGroupPrepend">
                                            <FontAwesomeIcon icon={faUser}/>
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
                                <p className={"mb-0 mb-3"}>Don't have an account? <Link
                                    className={"text-dark fw-semibold"} to={"/register"}>Create
                                    an
                                    account.</Link></p>
                                <Button variant={"dark"} className={"w-100 py-2"} type="submit">Submit</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </>
    )
}

export default Login