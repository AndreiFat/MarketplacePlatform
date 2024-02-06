import {Navigate, useNavigate} from "react-router-dom";
import requestToURL from "./fetchUtil.js";
import {useEffect, useState} from "react";
import {useLocalState} from "./useLocalState.js";


const PrivateRoute = (Component) => {

    return (props) => {
        const [jwt, setJwt] = useLocalState("", "jwt");
        const [isLoading, setIsLoading] = useState(true);
        const [isValid, setIsValid] = useState(null);
        const navigate = useNavigate();
        const [component, setcomponent] = useState(null)
        useEffect(() => {
            if (jwt) {
                requestToURL(
                    `http://localhost:8080/api/auth/validate?token=${jwt}`,
                    "GET",
                    jwt
                ).then((isValid) => {
                    console.log(isValid)
                    if (isValid) {
                        if (isValid === true) {
                            setcomponent(<Component {...props} />)
                        } else {
                            localStorage.removeItem("jwt");
                            setcomponent(<Navigate to="/login"/>)
                        }
                    }
                });
            }

        }, []);

        return component;
    }
};

export default PrivateRoute;