import {Link, useParams} from "react-router-dom";
import Button from "react-bootstrap/Button";
import {useEffect, useState} from "react";

function ViewProductPage() {
    const {productId} = useParams();
    console.log(productId);

    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: 0,
        categoryId: {
            id: null,
            name: ''
        },
        stock: 0,
        rating: 0,
    });
    const [categories, setCategories] = useState(null);
    const [reviews, setReviews] = useState(null);

    useEffect(() => {
        console.log(productId);

        fetch('http://localhost:8080/categories/viewCategories', {
            headers: {
                "Content-Type": "application/json",
            },
            method: 'GET'
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((categoriesData) => {
                setCategories(categoriesData);
                console.log(categoriesData);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });


        fetch(`http://localhost:8080/products/${productId}`, {
            headers: {
                "Content-Type": "application/json",
            }, method: 'GET'
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
            })
            .then((data) => {
                setProduct(data)
                console.log(data)
            });
    }, [productId]);

    useEffect(() => {
        fetch(`http://localhost:8080/products/${productId}/viewReviews`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: 'GET'
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((reviewsData) => {
                setReviews(reviewsData);
                console.log(reviewsData);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    }, []);


    return (
        <>
            <p> aici va fi pagina produsului cu id ul {productId}</p>
            <div>Titlul produsului: <b>{product.name}</b></div>
            <div>Descriere: {product.description}</div>
            <div>Categoria: {product.categoryId.id} {product.categoryId.name}</div>
            <div>Pret: {product.price} $</div>
            <div>Stoc: {product.stock}</div>
            <div>Rating: {product.rating}</div>
            <span><Button variant="info"><Link
                to={`/${product.id}/addReview`}>Add review</Link></Button></span>

            <p>aici o sa fie si review-urile la produsul cu id-ul {productId}</p>
            {
                reviews ? (
                        reviews.map((review) => (
                            <div key={review.id}>
                                <span>Descriere review: {review.description}</span>
                                <span>Number of stars: {review.numberOfStars} * </span>

                                {/*de facut sa avem si edit/delete pe reviews doar daca e autentificat userul*/}

                                
                                {/*<span><Button variant="warning"><Link*/}
                                {/*    to={`/editProducts/${product.id}`}>Edit</Link></Button></span>*/}
                                {/*<span><Button variant="danger">Delete</Button></span>*/}
                            </div>
                        )))
                    : (<></>)}
        </>
    )
}

export default ViewProductPage