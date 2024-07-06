import {Container} from "react-bootstrap";
import {Outlet} from "react-router-dom";
import AdminHeader from "../components/AdminHeader.jsx";
import Footer from "../components/Footer.jsx";
import RouteVerifier from "../components/RouteVerifier.jsx";

function GeneralLayout() {
    return (
        <>
            <Container fluid className={"p-0 mt-5"}>
                <AdminHeader/>
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