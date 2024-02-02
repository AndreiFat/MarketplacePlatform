import {Container} from "react-bootstrap";
import Header from "../components/Header.jsx";
import {Outlet} from "react-router-dom";
import Footer from "../components/Footer.jsx";

function GeneralLayout() {
    return (
        <>
            <Container fluid className={"p-0"}>
                <Header/>
                <Container>
                    <Outlet/>
                </Container>
                <Footer/>
            </Container>
        </>
    )
}

export default GeneralLayout