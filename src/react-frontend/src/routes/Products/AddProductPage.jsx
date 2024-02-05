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

    const [images, setImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [product, setProduct] = useState(null);


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
        };

        const form = new FormData();

        for (let i = 0; i < images.length; i++) {
            form.append('files', images[i]);
        }


        const sendData = async () => {

            const productFetch = await fetch('http://localhost:8080/products/addProduct', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                method: 'POST',
                body: JSON.stringify(product),
            })
            const productDetails = await productFetch.json();
            if (productDetails) {
                console.log(productDetails);
                setProduct(productDetails);
            } else {
                console.error('User details are null or undefined.');
            }

            const imagesFetch = await fetch(`http://localhost:8080/products/saveImagesToProduct/${productDetails.id}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                method: 'POST',
                body: form
            });
            const imageDetails = await imagesFetch.json();
            if (imageDetails) {
                console.log(imageDetails);
                setImages(imageDetails);
            } else {
                console.error('User details are null or undefined.');
            }
        }
        sendData()
    }


    return (
        <>
            <Form encType="multipart/form-data">
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
                        onChange={(e) => setImages([...images, ...e.target.files])}
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