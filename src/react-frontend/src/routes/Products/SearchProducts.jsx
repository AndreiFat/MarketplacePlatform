import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useLocalState} from "../../Utilities/useLocalState.js";
import {jwtDecode} from "jwt-decode";
function SearchProducts() {
    const apiURL = import.meta.env.VITE_API_URL;
    const [products, setProducts] = useState([]);
    const location = useLocation();
    let userEmail = ""

    const [jwt, setJwt] = useLocalState("", "jwt");
    if (jwt !== "") {
        const decodedToken = jwtDecode(jwt);
        userEmail = decodedToken.sub;
        console.log("decodat " + userEmail);
    }

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('query');
        const category = params.get('category');

        fetch(`${apiURL}/products/search?query=${query}&category=${category}`)
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching products:', error));
    }, [location.search]);

    return (
        <div className="container mt-5">
            <h1>Search Results</h1>
            {products.length > 0 ? (
                <div className="row">
                    {products.map(product => (
                        <div key={product.id} className="col-md-4">
                            <div className="card mb-4 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text">{product.description}</p>
                                    <p className="card-text">Price: ${product.price}</p>
                                    <p className="card-text">Stock: {product.stock}</p>
                                    <p className="card-text">Rating: {product.rating}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No products found</p>
            )}
        </div>
    );
}

export default SearchProducts