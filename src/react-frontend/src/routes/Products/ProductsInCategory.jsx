import {useNavigate, useParams} from "react-router-dom";
import Button from "react-bootstrap/Button";
import {useEffect, useState} from "react";
import {useLocalState} from "../../Utilities/useLocalState.js";

import {Breadcrumb, Card, Col, Form, Modal, Row} from "react-bootstrap";
import {jwtDecode} from "jwt-decode";
import ProductCarousel from "../../components/CarouelProduct.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBoxesStacked} from "@fortawesome/free-solid-svg-icons";
import StarRating from "../../components/StarRating.jsx";
import ReviewAccordion from "../../components/ReviewAccordion.jsx";
import Accordion from "react-bootstrap/Accordion";
import Product from "../../components/Product.jsx";

function ProductsInCategory() {
    let userEmail = "";

    const [jwt, setJwt] = useLocalState("", "jwt");
    if (jwt !== "") {
        const decodedToken = jwtDecode(jwt);
        userEmail = decodedToken.sub;
        console.log("decodat " + userEmail);
    }

    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8080/products/productsInCategory?categoryId=${categoryId}`,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching products:', error));
    }, [categoryId]);

    return (
        <>
            {products ? (
                products.map((product) => (
                    <div>
                        {product.name}
                    </div>


                ))) : (<></>)
            }
        </>
    )
}

export default ProductsInCategory