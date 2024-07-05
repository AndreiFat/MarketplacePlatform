import React from 'react';
import {useNavigate} from 'react-router-dom';
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const BackButton = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Navigate back in the history
    };

    return (
        <div className={"bg-success-subtle rounded-3"} style={{height: "42px", width: "42px"}}>
            <button className={"btn bg-transparent w-100 h-100 text-dark"} onClick={handleBack}><FontAwesomeIcon
                icon={faArrowLeft}/>
            </button>
        </div>
    );
};
export default BackButton