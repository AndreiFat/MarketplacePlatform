import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import Button from 'react-bootstrap/Button';

function Homepage() {
    const [products, setProducts] = useState(null)

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

    // function deleteProduct(productId) {
    //
    //     // Perform the delete request
    //     fetch(`http://localhost:8080/products/deleteProduct/${productId}`, {
    //         method: 'DELETE',
    //     })
    //         .then((response) => {
    //             if (response.status === 200) {
    //                 // Successful delete, redirect to a different page or handle accordingly
    //                 history.push('/'); // Redirect to the product list page
    //             } else {
    //                 throw new Error('Failed to delete product');
    //             }
    //         })
    //         .catch((error) => {
    //             console.error('Error deleting product:', error);
    //         });
    // }


    return (
        <div className="container justify-content-center">
            <Button variant="light"><Link to={'/addingProducts'}>Add a product</Link></Button>
            {
                products ? (
                        products.map((product) => (
                            <div key={product.id}>
                                <span>{product.id}</span>
                                <span>{product.name}</span>
                                <span>{product.price}</span>
                                <span><Button variant="warning"><Link
                                    to={`/editProducts/${product.id}`}>Edit</Link></Button></span>
                                <span><Button variant="danger">Delete</Button></span>
                                <span><Button variant="info"><Link
                                    to={`/${product.id}/addReview`}>Add review</Link></Button></span>
                            </div>
                        )))
                    : (<></>)}
        </div>
    )
}

export default Homepage