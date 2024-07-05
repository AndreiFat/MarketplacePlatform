import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useLocalState} from "../../Utilities/useLocalState.js";
import AdminRoute from "../../Utilities/AdminRoute.jsx";
import {Card, Col, Row,} from "react-bootstrap";


function EditProductPage() {
    //fetch pentru produsul respectiv
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: 0,
        priceAfterDiscount: 0,
        priceDiscount: 0,
        categoryId: {
            id: null,
            name: ''
        },
        stock: 0,
        rating: 0,
    });

    const navigate = useNavigate();
    const [categories, setCategories] = useState(null);

    const [jwt, setJwt] = useLocalState("", "jwt");

    const {productId} = useParams();

    const [categoryIdEdit, setCategoryIdEdit] = useState("");
    const {name, description, price, priceAfterDiscount, priceDiscount, categoryId, stock} = product;
    const [priceWithDiscount, setPriceWithDiscount] = useState(0)

    useEffect(() => {
        let newPrice = 0;
        newPrice = product.price - (product.priceDiscount * product.price) / 100;
        if (product.priceDiscount !== 0) {
            product.priceAfterDiscount = newPrice;
            setPriceWithDiscount(newPrice)
        }
        console.log(product.priceAfterDiscount);
    }, [product]);

    useEffect(() => {
        console.log(productId);

        fetch('http://localhost:8080/categories/viewCategories', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
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
                Authorization: `Bearer ${jwt}`
            }, method: 'GET'
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
            })
            .then((data) => {
                setProduct(data)
                setCategoryIdEdit(data.categoryId.id)
                console.log(data)
            });
    }, [productId]);

    //apoi edit pentru produsul respectiv

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedCategoryIndex = categories !== null ? categories.findIndex(category => category.id === parseInt(categoryIdEdit, 10)) : -1;
        console.log(selectedCategoryIndex);

        const product = {
            name,
            description,
            price,
            priceAfterDiscount,
            priceDiscount,
            categoryId: {
                id: parseInt(categoryIdEdit),
                name: categories[selectedCategoryIndex].name
            },
            stock
        };

        fetch(`http://localhost:8080/products/editProduct/${productId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: 'PUT',
            body: JSON.stringify(product),
        }).then((response) => {
            console.log(response.status)
        })
            .then((product) => {
                console.log(product);
                navigate("/admin");
            });
    }


    return (
        <>
            <Row className={"justify-content-center pt-3"}>
                <Col md={7}>
                    <Card className={"p-4 border-0 rounded-4 shadow-sm"}>
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
                                    as="textarea" rows={4}
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

                            <Form.Group className="mb-3" controlId="exampleForm.priceDiscount">
                                <Form.Label>Price discount (if exists)</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="13.38 $"
                                    value={priceDiscount}
                                    onChange={(e) => setProduct({...product, priceDiscount: e.target.value})}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" name="priceAfterDiscount"
                                        controlId="exampleForm.priceAfterDiscount">
                                <Form.Label>Price After Discount Applied</Form.Label>
                                <Form.Control type="text" value={priceWithDiscount}
                                              onChange={(e) => setProduct({
                                                  ...product,
                                                  priceAfterDiscount: e.target.value
                                              })}
                                              aria-label="Disabled input example" disabled readOnly/>
                            </Form.Group>

                            <Form.Group className="mb-3" name="categoryIdEdit"
                                        controlId="exampleForm.categoryIdEdit">
                                <Form.Label>Category</Form.Label>
                                <Form.Select name="categoryIdEdit" value={categoryIdEdit}
                                             onChange={(e) => setCategoryIdEdit(e.target.value)}>
                                    <option value="">Select option</option>
                                    {categories !== null && categories.map(category => (
                                        <option key={category.id} value={category.id}
                                                data-array={categories.indexOf(category)}>
                                            {category.name}
                                        </option>
                                    ))}

                                </Form.Select>
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
                                <Button variant="danger" className={"me-3 px-4 py-3 rounded-4"}>
                                    <Link className={"text-decoration-none text-white"} to={'/'}>Cancel</Link>
                                </Button>
                                <Button className={"rounded-4 px-4 py-3"} variant="dark" type="submit"
                                        onClick={handleSubmit}>
                                    Update product
                                </Button>
                            </Form.Group>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default AdminRoute(EditProductPage)