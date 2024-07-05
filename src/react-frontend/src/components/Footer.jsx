import {Col, Container, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import {faCircleUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebook, faInstagram, faLinkedin} from "@fortawesome/free-brands-svg-icons";

function Footer() {
    return (
        <>
            <Container fluid className={"mt-4 bg-dark"}>
                <Container>
                    <div className={"d-flex align-items-center justify-content-between py-4"}>
                        <div>
                            <div className="d-flex align-items-center gap-3">
                                <img
                                    src="/src/assets/Logo.png"
                                    className="d-inline-block align-top me-1"
                                    alt="React Bootstrap logo"
                                    height={"54px"}
                                />
                                <h4 className={"text-white mb-0"}>marketcup</h4>
                            </div>
                            <p className="opacity-50 bg-dark text-white mb-0 mt-2">© 2024 MARKETCUP | All rights
                                reserved</p>
                        </div>
                        <div className="d-flex gap-2">
                            <Link to={"/"} className={"me-4 my-0 text-decoration-none text-white"}>Home</Link>
                            <Link to={"/accountSettings"} className={"me-4 my-0 text-decoration-none text-white"}>Account
                                Settings</Link>
                            <Link to={"/user/ManageOrders"}
                                  className={"me-4 my-0 text-decoration-none text-white"}>Orders</Link>
                        </div>
                        <div className="pe-5 me-2 d-flex gap-3">
                            <FontAwesomeIcon icon={faFacebook} className="text-white" size={"xl"}/>
                            <FontAwesomeIcon icon={faInstagram} className="text-white" size={"xl"}/>
                            <FontAwesomeIcon icon={faLinkedin} className="text-white" size={"xl"}/>
                        </div>
                    </div>
                </Container>
            </Container>
        </>
    )
}

export default Footer