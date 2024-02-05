import {Container, Navbar} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {useState} from "react";

function Header() {

    // const { openCart, cartQuantity } = useShoppingCart()
    const {cartQuantity, setCartQuantity} = useState(0)


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
                        <Link to={"/favourite-products"} className={"me-4"}><FontAwesomeIcon icon={faHeart}
                                                                                             size={"xl"}/></Link>
                        <Link to={"/login"} className={"me-4"}>Login</Link>
                        <Link to={"/register"} className={"me-4"}>Register</Link>
                        <Link to={"/accountSettings"} className={"me-4"}>Account Settings</Link>
                    </div>
                </Container>
            </Navbar>
        </>
    )
}

export default Header