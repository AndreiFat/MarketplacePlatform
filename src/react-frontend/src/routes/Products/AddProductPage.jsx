import Form from 'react-bootstrap/Form';
import {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";
import {useLocalState} from "../../Utilities/useLocalState.js";


function AddProductPage() {
    const [jwt, setJwt] = useLocalState("", "jwt");

    const [products, setProducts] = useState(null);
    const [categories, setCategories] = useState(null);
    const [name, setName] = useState(null)
    const [description, setDescription] = useState(null)
    const [price, setPrice] = useState(0)
    const [categoryId, setCategoryId] = useState("")
    const [stock, setStock] = useState(0)
    const [rating, setRating] = useState(0)

    const [images, setImages] = useState([])
    const [selectedFiles, setSelectedFiles] = useState([]);


    useEffect(() => {
        fetch('http://localhost:8080/categories/viewCategories', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
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
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedCategoryIndex = categories !== null ? categories.findIndex(category => category.id === parseInt(categoryId, 10)) : -1;
        console.log(selectedCategoryIndex);

        // Get the paths of the selected files and update the state
        const paths = selectedFiles.map((file) => URL.createObjectURL(file));
        setImages(paths);

        const product = {
            name,
            description,
            price,
            categoryId: {
                id: parseInt(categoryId),
                name: categories[selectedCategoryIndex].name
            },
            stock,
            rating,
            images
        };
        console.log(images)

        fetch('http://localhost:8080/products/addProduct', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: 'POST',
            body: JSON.stringify(product),
        }).then((response) => response.json())
            .then((product) => {
                console.log(product);
            });
    }


    return (
        <>
            <Form>
                <Form.Group className="mb-3" name="name" value={name} onChange={(e) => setName(e.target.value)}
                            controlId="exampleForm.name">
                    <Form.Label>Product name</Form.Label>
                    <Form.Control type="text"/>
                </Form.Group>

                <Form.Group className="mb-3" name="description" value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            controlId="exampleForm.description">
                    <Form.Label>Product description</Form.Label>
                    <Form.Control type="text"/>
                </Form.Group>

                <Form.Group className="mb-3" name="price" value={price} onChange={(e) => setPrice(e.target.value)}
                            controlId="exampleForm.price">
                    <Form.Label>Product price</Form.Label>
                    <Form.Control type="number"/>
                </Form.Group>

                <Form.Group className="mb-3" name="categoryId" value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            controlId="exampleForm.categoryId">
                    <Form.Label>Category</Form.Label>
                    <select name="categoryId" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                        <option value="">Select Category</option>
                        {categories !== null && categories.map(category => (
                            <option key={category.id} value={category.id} data-array={categories.indexOf(category)}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </Form.Group>

                <Form.Group className="mb-3" name="stock" value={stock} onChange={(e) => setStock(e.target.value)}
                            controlId="exampleForm.stock">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control type="number"/>
                </Form.Group>

                <Form.Group className="position-relative mb-3">
                    <Form.Label>Images</Form.Label>
                    <Form.Control
                        type="file"
                        multiple
                        required
                        name="file"
                        onChange={(e) => setSelectedFiles([...selectedFiles, ...e.target.files])}
                    />
                    <Form.Control.Feedback type="invalid" tooltip>
                        {/*{errors.file}*/}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Button color="primary" type="submit" onClick={handleSubmit}>Add product</Button>
                    <Button variant="danger"><Link to={'/'}>Cancel</Link></Button>
                </Form.Group>

            </Form>
        </>
    )
}

export default AddProductPage