import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-solid-svg-icons";

function FavouriteProducts() {

    const navigate = useNavigate();

    const user = {
        id: 1
    }
    const [products, setProducts] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/favoriteProducts/viewFavoriteProducts/${user.id}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: 'GET',
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch products. Status: ${response.status}`);
                }

                const productsData = await response.json();
                setProducts(productsData);
                console.log(productsData);
                console.log(products);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        console.log("called twice")
        fetchData()
    }, []);

    function saveAsFavourite(product) {
        const favouriteProduct = {
            productId: {
                id: product.productId.id
            },
            userId: {
                id: user.id
            }
        }
        console.log(`Saving as favourite ${product.productId.id}`)
        fetch(`http://localhost:8080/favoriteProducts/toggleProduct`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: 'POST',
            body: JSON.stringify(favouriteProduct),
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.status)
                    window.location.reload()
                } else {
                    console.log("Failed to save!")
                }
            })
            .catch((error) => {
                console.error('Error saving product:', error);
            });
    }

    return (
        <>
            {
                products ? (
                        products.map((product) => (
                            <div key={product.id}>
                                <Link to={`${product.id}`}><span>{product.id}</span></Link>
                                <span>{product.name}</span>
                                <span>{product.price}</span>
                                <span><Button variant="warning"><Link
                                    to={`/editProducts/${product.id}`}>Edit</Link></Button></span>
                                <span><Button variant="primary"
                                              onClick={() => saveAsFavourite(product)}><FontAwesomeIcon icon={faHeart}
                                                                                                        size={"xl"}/></Button></span>
                            </div>
                        )))
                    : (<></>)}
        </>
    )
}

export default FavouriteProducts