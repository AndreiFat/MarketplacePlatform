import Form from 'react-bootstrap/Form';
import {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {Link, useNavigate} from "react-router-dom";
import {useLocalState} from "../../Utilities/useLocalState.js";
import AdminRoute from "../../Utilities/AdminRoute.jsx";
import {Card} from "react-bootstrap";
import BackButton from "../../components/BackButton.jsx";

function AddProductPage() {
    const apiURL = import.meta.env.VITE_API_URL;
    const [jwt, setJwt] = useLocalState("", "jwt");

    const [products, setProducts] = useState(null);
    const [categories, setCategories] = useState(null);
    const [name, setName] = useState(null)
    const [description, setDescription] = useState(null)
    const [price, setPrice] = useState(0)
    const [categoryId, setCategoryId] = useState("")
    const [stock, setStock] = useState(0)
    const [rating, setRating] = useState(0)
    const [priceDiscount, setPriceDiscount] = useState(0)

    const [images, setImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [product, setProduct] = useState(null);
    const [priceAfterDiscount, setPriceAfterDiscount] = useState(0);

    const navigate = useNavigate();


    useEffect(() => {
        fetch(`${apiURL}/categories/viewCategories`, {
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

    useEffect(() => {
        let newPrice = 0;
        newPrice = price - (priceDiscount * price) / 100;
        setPriceAfterDiscount(newPrice);
        console.log(priceAfterDiscount)
    }, [priceDiscount]);

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
            priceDiscount,
            priceAfterDiscount
        };

        const form = new FormData();

        for (let i = 0; i < images.length; i++) {
            form.append('files', images[i]);
        }


        const sendData = async () => {

            const productFetch = await fetch(`${apiURL}/products/addProduct`, {
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

            const imagesFetch = await fetch(`${apiURL}/products/saveImagesToProduct/${productDetails.id}`, {
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
        navigate("/admin")
    }


    return (
        <>
            <div className="d-flex gap-3 align-items-center">
                <BackButton></BackButton>
                <h3 className={"my-3"}>Add products</h3>
            </div>
            <Card className={"border-0 rounded-4 shadow-sm"}>
                <Card.Body className={"p-4"}>
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
                            <Form.Control type="text" as={"textarea"} rows={4}/>
                        </Form.Group>

                        <Form.Group className="mb-3" name="price" value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    controlId="exampleForm.price">
                            <Form.Label>Product price</Form.Label>
                            <Form.Control type="number"/>
                        </Form.Group>

                <Form.Group className="mb-3" name="priceDiscount" value={priceDiscount}
                            onChange={(e) => setPriceDiscount(e.target.value)}
                            controlId="exampleForm.priceDiscount">
                    <Form.Label>Price Discount (if exists)</Form.Label>
                    <Form.Control type="number"/>
                </Form.Group>

                <Form.Group className="mb-3" name="priceAfterDiscount" value={priceAfterDiscount}
                            onChange={(e) => setPriceDiscount(e.target.value)}
                            controlId="exampleForm.priceAfterDiscount">
                    <Form.Label>Price After Discount Applied</Form.Label>
                    <Form.Control type="text" value={priceAfterDiscount} aria-label="Disabled input example" disabled
                                  readOnly/>
                </Form.Group>

                        <Form.Group className="mb-3" name="categoryId" value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    controlId="exampleForm.categoryId">
                            <Form.Label>Category</Form.Label>
                            <Form.Select name="categoryId" value={categoryId}
                                         onChange={(e) => setCategoryId(e.target.value)}>
                                <option value="">Select Category</option>
                                {categories !== null && categories.map(category => (
                                    <option key={category.id} value={category.id}
                                            data-array={categories.indexOf(category)}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" name="stock" value={stock}
                                    onChange={(e) => setStock(e.target.value)}
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

                        <Form.Group className={"mt-4"}>
                            <Button className={"me-3 px-4 py-3 rounded-4"} variant="danger"><Link
                                className={"text-decoration-none text-white"}
                                to={'/'}>Cancel</Link></Button>
                            <Button variant="dark" className={"px-4 py-3 rounded-4"} type="submit"
                                    onClick={handleSubmit}>Add
                                product</Button>

                        </Form.Group>

                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}

export default AdminRoute(AddProductPage)