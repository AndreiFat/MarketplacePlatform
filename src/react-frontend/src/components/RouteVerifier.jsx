import {matchPath} from "react-router-dom";

const RouteVerifier = ({path, pathName, children}) => {
    const match = matchPath(
        {
            path: path,
            caseSensitive: false, // Optional, `true` == static parts of `path` should match case
            end: true, // Optional, `true` == pattern should match the entire URL pathname
        },
        pathName
    );

    return (
        <>
            {match && children}
        </>
    );
};

export default RouteVerifier;