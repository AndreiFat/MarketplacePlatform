import {Col, Form, InputGroup} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import Button from "react-bootstrap/Button";
import {useLocalState} from "../../Utilities/useLocalState.js";

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
                // window.location.href = "/";
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
            <h3>Login</h3>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group as={Col} md="4" className={"mb-3"} controlId={`validationCustom${labels.email}`}>
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

                <Form.Group as={Col} md="4" className={"mb-3"} controlId={`validationCustom${labels.password}`}>
                    <Form.Label>{labels.password}</Form.Label>
                    <InputGroup hasValidation>
                        <InputGroup.Text id="inputGroupPrepend">
                            <FontAwesomeIcon icon={faUser}/>
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

                <Button type="submit">Submit form</Button>
            </Form>
        </>
    )
}

export default Login