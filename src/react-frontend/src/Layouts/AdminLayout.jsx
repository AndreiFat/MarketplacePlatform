import {Container} from "react-bootstrap";
import {Outlet} from "react-router-dom";
import AdminHeader from "../components/AdminHeader.jsx";

function GeneralLayout() {
    return (
        <>
            <Container fluid className={"p-0 mt-5"}>
                <AdminHeader/>
                <Container>
                    <Outlet/>
                </Container>
                {/*<Footer/>*/}
            </Container>
        </>
    )
}

export default GeneralLayout