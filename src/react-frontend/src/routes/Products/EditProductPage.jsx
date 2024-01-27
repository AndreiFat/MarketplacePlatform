import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function EditProductPage() {
    //fetch pentru produsul respectiv
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

    const {productId} = useParams();

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

    const {name, description, price, categoryId, stock} = product;
    console.log(`da ${product}`)

    //apoi edit pentru produsul respectiv

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedCategoryIndex = categories !== null ? categories.findIndex(category => category.id === parseInt(categoryId, 10)) : -1;
        console.log(selectedCategoryIndex);

        const product = {
            name,
            description,
            price,
            categoryId: {
                id: parseInt(categoryId),
                name: categories[selectedCategoryIndex].name
            },
            stock
        };

        fetch(`http://localhost:8080/products/editProduct/${productId}`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: 'PUT',
            body: JSON.stringify(product),
        }).then((response) => {
            console.log(response.status)
        })
            .then((product) => {
                console.log(product);
            });
    }


    return (
        <>
            <p>saloot de la edit</p>

            <Form>
                <Form.Group className="mb-3" controlId="exampleForm.name">
                    <Form.Label>Product name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Barbie Doll"
                        value={name}
                        onChange={(e) => setProduct({...product, name: e.target.value})}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.description">
                    <Form.Label>Product description</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Limited edition Barbie Doll."
                        value={description}
                        onChange={(e) => setProduct({...product, description: e.target.value})}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.price">
                    <Form.Label>Product price</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="13.38 $"
                        value={price}
                        onChange={(e) => setProduct({...product, price: e.target.value})}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.categoryId">
                    <Form.Label>Category</Form.Label>
                    <select
                        name="categoryId"
                        value={categoryId}
                        onChange={(e) => setProduct({...product, categoryId: e.target.value})}
                    >
                        <option value="">Select Category</option>
                        {categories !== null &&
                            categories.map((category) => (
                                <option key={category.id} value={category.id} data-array={categories.indexOf(category)}>
                                    {category.name}
                                </option>
                            ))}
                    </select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.stock">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="100"
                        value={stock}
                        onChange={(e) => setProduct({...product, stock: e.target.value})}
                    />
                </Form.Group>

                <Form.Group>
                    <Button color="primary" type="submit" onClick={handleSubmit}>
                        Update product
                    </Button>
                    <Button color="secondary">
                        <Link to={'/'}>Cancel</Link>
                    </Button>
                </Form.Group>
            </Form>


        </>
    )
}

export default EditProductPage