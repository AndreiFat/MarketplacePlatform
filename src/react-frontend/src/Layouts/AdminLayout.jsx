import {Container} from "react-bootstrap";
import {Outlet} from "react-router-dom";
import Footer from "../components/Footer.jsx";
import RouteVerifier from "../components/RouteVerifier.jsx";
import Header from "../components/Header.jsx";

function GeneralLayout() {
    return (
        <>
            <Container fluid className={"p-0 mt-5"}>
                <Header/>
                <Container>
                    <Outlet/>
                </Container>
                <RouteVerifier path={"/"} pathName={location.pathname}>
                    <Footer/>
                </RouteVerifier>
            </Container>
        </>
    )
}

export default GeneralLayout