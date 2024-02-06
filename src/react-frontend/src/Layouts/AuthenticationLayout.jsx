import {Container} from "react-bootstrap";
import Header from "../components/Header.jsx";
import {Outlet} from "react-router-dom";
import Footer from "../components/Footer.jsx";

function AuthenticationLayout() {
    return (
        <>
            <Container fluid className={"p-0"}>
                <Header/>
                <Container className={"mt-5"}>
                    <Outlet/>
                </Container>
                <div className={"fixed-bottom"}><Footer/></div>

            </Container>
        </>
    )
}

export default AuthenticationLayout