import {Col, Form, InputGroup} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";

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
            <h3>Register</h3>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group as={Col} md="4" className={"mb-3"} controlId={`validationCustom${labels.name}`}>
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

                <Form.Group as={Col} md="4" className={"mb-3"} controlId={`validationCustom${labels.surname}`}>
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

                <Form.Group as={Col} md="4" className={"mb-3"} controlId={`validationCustom${labels.dateOfBirth}`}>
                    <Form.Label>{labels.dateOfBirth}</Form.Label>
                    <InputGroup hasValidation>
                        <InputGroup.Text id="inputGroupPrepend">
                            <FontAwesomeIcon icon={faUser}/>
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

                <Form.Group as={Col} md="4" className={"mb-3"} controlId={`validationCustom${labels.phoneNumber}`}>
                    <Form.Label>{labels.phoneNumber}</Form.Label>
                    <InputGroup hasValidation>
                        <InputGroup.Text id="inputGroupPrepend">
                            <FontAwesomeIcon icon={faUser}/>
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

                <Button type="submit">Submit form</Button>
            </Form>
        </>
    )
}

export default Register