import {useEffect} from "react";
import {useLocalState} from "./useLocalState.js";
import {jwtDecode} from "jwt-decode";
import {useNavigate} from "react-router-dom";

const AdminRoute = (Component) => {
    return (props) => {
        const [jwt, setJwt] = useLocalState("", "jwt");

        const decodedToken = jwtDecode(jwt);
        const userRole = decodedToken.authorities;
        const isAdmin = userRole.includes('ROLE_ADMIN');  //verific rolul userului din jwt
        const navigate = useNavigate();

        useEffect(() => {
            if (!isAdmin) {
                console.log(userRole);
                navigate('/login');   //daca userul nu este admin, va fi redirectionat la login
            }
        }, [isAdmin]);

        return isAdmin ? <Component {...props} /> : null;   //daca e admin, redirectionez pagina dorita
    };
};

export default AdminRoute;