import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Button from 'react-bootstrap/Button';

function Homepage() {
    const [products, setProducts] = useState(null)

    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/products/viewProducts', {
            headers: {
                "Content-Type": "application/json",
            }, method: 'GET'
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
            })
            .then((productsData) => {
                setProducts(productsData)
                console.log(productsData)
                console.log(products)
            });
    }, []);

    function deleteProduct(productId) {
        fetch(`http://localhost:8080/products/deleteProduct/${productId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.status === 200) {
                    navigate('/');
                } else {
                    console.log("Failed to delete!")
                }
            })
            .catch((error) => {
                console.error('Error deleting product:', error);
            });
    }


    return (
        <div className="container justify-content-center">
            <Button variant="light"><Link to={'/addingProducts'}>Add a product</Link></Button>
            {
                products ? (
                        products.map((product) => (
                            <div key={product.id}>
                                <Link to={`${product.id}`}><span>{product.id}</span></Link>
                                <span>{product.name}</span>
                                <span>{product.price}</span>
                                <span><Button variant="warning"><Link
                                    to={`/editProducts/${product.id}`}>Edit</Link></Button></span>
                                <span><Button variant="danger"
                                              onClick={() => deleteProduct(product.id)}>Delete</Button></span>
                            </div>
                        )))
                    : (<></>)}
        </div>
    )
}

export default Homepage