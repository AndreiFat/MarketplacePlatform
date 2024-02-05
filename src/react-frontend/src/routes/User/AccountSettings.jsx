import {useLocalState} from "../../Utilities/useLocalState.js";
import {useState} from "react";
import {jwtDecode} from "jwt-decode";
import {Col, Form, InputGroup} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";

function AccountSettings() {
    const [validated, setValidated] = useState(false);
    const [jwt, setJwt] = useLocalState("", "jwt");

    const decodedToken = jwtDecode(jwt);
    const userEmail = decodedToken.sub;

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

        fetch('http://localhost:8080/users/viewUser', {
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

        fetch(`http://localhost:8080/users/edit/${user.id}`, {
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

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }

        setValidated(true);
    };

    return (
        <>
            aici e userul care va avea datele contului
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group as={Col} md="4" className={"mb-3"} controlId={`validationCustom${labels.name}`}>
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

                <Form.Group as={Col} md="4" className={"mb-3"} controlId={`validationCustom${labels.surname}`}>
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

                <Form.Group as={Col} md="4" className={"mb-3"} controlId={`validationCustom${labels.dateOfBirth}`}>
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

                <Form.Group as={Col} md="4" className={"mb-3"} controlId={`validationCustom${labels.email}`}>
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

                <Form.Group as={Col} md="4" className={"mb-3"} controlId={`validationCustom${labels.password}`}>
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

                <Form.Group as={Col} md="4" className={"mb-3"} controlId={`validationCustom${labels.phoneNumber}`}>
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

                <Button type="submit">Submit form</Button>
            </Form>

            <Link to={"/addresses"} className={"me-4"}>Manage Addresses</Link>
        </>
    )
}

export default AccountSettings;