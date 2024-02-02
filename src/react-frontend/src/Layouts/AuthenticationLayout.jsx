import {Container} from "react-bootstrap";
import Header from "../components/Header.jsx";
import {Outlet} from "react-router-dom";
import Footer from "../components/Footer.jsx";

function AuthenticationLayout() {
    return (
        <>
            <Container fluid className={"p-0"}>
                <Header/>
                Aici este layoutul pentru autentificare
                <Container>
                    <Outlet/>
                </Container>
                <Footer/>
            </Container>
        </>
    )
}

export default AuthenticationLayout