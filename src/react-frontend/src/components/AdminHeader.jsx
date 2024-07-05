import {Container, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {useLocalState} from "../Utilities/useLocalState.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleUser, faHeart} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";

function AdminHeader() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [jwt, setJwt] = useLocalState("", "jwt");

    useEffect(() => {
        if (jwt) {
            // Decode JWT
            const decoded = jwtDecode(jwt);

            // Check if JWT is expired
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                // JWT expired, user is not logged in
                setLoggedIn(false);
            } else {
                // JWT valid, user is logged in
                setLoggedIn(true);
            }
        } else {
            Cookies.remove('order');
            // No JWT found, user is not logged in
            setLoggedIn(false);
        }
    }, []);

    return (
        <>
            <Navbar expand="lg" className="shadow-sm bg-white mb-4 py-3" fixed={"top"}>
                <Container>
                    <Navbar.Brand href="/" className={"d-flex align-items-center gap-3"}>
                        <img
                            src="/src/assets/Logo.png"
                            className="d-inline-block align-top me-1"
                            alt="React Bootstrap logo"
                            height={"36px"}
                        />
                        <h4 className={"mb-0"}>Admin Panel</h4>
                    </Navbar.Brand>
                    {
                        loggedIn ? (
                            <div>

                                <Link to={"/favourite-products"}
                                      className={" text-decoration-none text-danger me-4"}><FontAwesomeIcon
                                    icon={faHeart}
                                    size={"2xl"}/></Link>
                                <Link to={"/accountSettings"}
                                      className={"text-decoration-none btn btn-outline-dark rounded-pill"}>
                                    <span className={"me-2"}>Account </span><FontAwesomeIcon icon={faCircleUser}
                                                                                             size={"2xl"}/>
                                </Link>
                            </div>
                        ) : (
                            <div>

                                <span className={"text-dark"}>
                            <Link to={"/login"} className={"me-4 text-decoration-none text-dark"}>Login</Link>
                        <Link to={"/register"} className={"me-4 text-decoration-none text-dark"}>Register</Link>
                        </span>
                                {/*<Link to={"/accountSettings"} className={"me-4"}>Account Settings</Link>*/}
                            </div>
                        )
                    }

                </Container>
            </Navbar>
        </>
    )
}

export default AdminHeader