import {Container, Navbar} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCartShopping, faHeart} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function Header() {
    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary mb-4 py-3" sticky={"top"}>
                <Container>
                    <Navbar.Brand href="/">
                        <img
                            src="/src/assets/react.svg"
                            width="30"
                            height="30"
                            className="d-inline-block align-top me-1"
                            alt="React Bootstrap logo"
                        />
                        Web Marketplace
                    </Navbar.Brand>
                    <div>
                        <Form className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                            />
                            <Button variant="outline-success">Search</Button>
                        </Form>
                    </div>
                    <div>
                        <Link to={"/favourite-products"} className={"me-4"}><FontAwesomeIcon icon={faHeart}
                                                                                             size={"xl"}/></Link>
                        <Link to={"/shopping-cart"} className={"me-4"}><FontAwesomeIcon icon={faCartShopping}
                                                                                        size={"xl"}/></Link>
                        <Link to={"/login"} className={"me-4"}>Login</Link>
                        <Link to={"/register"} className={"me-4"}>Register</Link>
                        <Link to={"/accountSettings"} className={"me-4"}>Account Settings</Link>
                        <Link to={"/addresses"} className={"me-4"}>Addresses</Link>
                    </div>
                </Container>
            </Navbar>
        </>
    )
}

export default Header