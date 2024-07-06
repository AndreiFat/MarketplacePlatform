import {Container, FormControl, Navbar} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {useLocalState} from "../Utilities/useLocalState.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleUser, faHeart, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import RouteVerifier from "./RouteVerifier.jsx";

function Header() {

    const apiURL = import.meta.env.VITE_API_URL;
    const [loggedIn, setLoggedIn] = useState(false);
    const [jwt, setJwt] = useLocalState("", "jwt");

    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    let userEmail = ""
    let userRole = ""

    if (jwt) {
        const decodedToken = jwtDecode(jwt);
        userEmail = decodedToken.sub;
        userRole = decodedToken.authorities;
    }

    const isAdmin = userRole.includes('ROLE_ADMIN');

    function handleSearch(e) {
        e.preventDefault();
        console.log("Form submitted", query);
        navigate(`/search?query=${query}`);
    }

    const [user, setUser] = useState({
        name: "",
        surname: "",
        email: "",
        dateOfBirth: "",
        password: "",
        phoneNumber: "",
    });

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
            <Navbar expand="lg" className="shadow-sm bg-white mb-4" fixed={"top"}>
                <Container>
                    <Navbar.Brand href="/" className={"d-flex align-items-center gap-3"}>
                        <img
                            src="/src/assets/Logo.png"
                            className="d-inline-block align-top me-1"
                            alt="React Bootstrap logo"
                            height={"54px"}
                        />
                        <RouteVerifier path={"/admin"} pathName={location.pathname}>
                            {isAdmin ? <h5 className={"mb-0"}>Admin Panel</h5> : <></>}
                        </RouteVerifier>
                    </Navbar.Brand>
                    <Form className="d-flex w-25" onSubmit={event => handleSearch(event)}>
                        <FormControl
                            id="searchBar"
                            name="search"
                            type="text"
                            placeholder="Search"
                            className="rounded-start-4 rounded-end-0 py-2 px-4 border border-end-0"
                            aria-label="Search"
                            value={query}
                            onChange={(e) => {
                                e.preventDefault()
                                console.log(e.target.value)
                                setQuery(e.target.value)
                            }}
                        />
                        <Button variant="outline-success" className={"rounded-start-0 rounded-end-4 px-3"}
                                type="submit"><FontAwesomeIcon
                            size={"lg"} icon={faMagnifyingGlass}/></Button>
                    </Form>
                    {
                        loggedIn ? (
                            <div>

                                <Link to={"/favourite-products"}
                                      className={" text-decoration-none text-danger me-4"}><FontAwesomeIcon
                                    icon={faHeart}
                                    size={"2xl"}/></Link>
                                <Link to={"/accountSettings"}
                                      className={"text-decoration-none btn btn-outline-success rounded-pill"}>
                                    <span className={"me-2"}>{user ? `${user.name} ${user.surname}` : "Account"} </span><FontAwesomeIcon
                                    icon={faCircleUser}
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

export default Header