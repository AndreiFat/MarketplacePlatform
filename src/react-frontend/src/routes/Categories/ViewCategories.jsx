import {useState} from "react";
import {useLocalState} from "../../Utilities/useLocalState.js";
import AdminRoute from "../../Utilities/AdminRoute.jsx";
import Button from "react-bootstrap/Button";
import {Card, Col, Form, Modal, Row} from "react-bootstrap";
import BackButton from "../../components/BackButton.jsx";

function ViewCategories() {
    const apiURL = import.meta.env.VITE_API_URL;
    const [categories, setCategories] = useState(null);
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [categoryName, setCategoryName] = useState("");
    const [categoryEdit, setCategoryEdit] = useState("")

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    useState(() => {
        fetch(`${apiURL}/categories/viewCategories`, {
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
    });

    const handleSubmit = (e) => {
        console.log(categoryName);

        e.preventDefault();
        const category = {
            name: categoryName
        };

        fetch(`${apiURL}/categories/addCategory`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: 'POST',
            body: JSON.stringify(category),
        }).then((response) => response.json())
            .then((category) => {
                console.log(category);
                window.location.reload();
            });
    }

    function deleteCategory(categoryId) {
        fetch(`${apiURL}/categories/deleteCategory/${categoryId}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            },
            method: 'DELETE',
        })
            .then((response) => {
                if (response.status === 200) {
                    window.location.reload();
                } else {
                    console.log("Failed to delete!")
                }
            })
            .catch((error) => {
                console.error('Error deleting category:', error);
            });
    }

    function editCategory(categoryId, e) {

        const categoryBody = {
            name: categoryEdit
        };

        fetch(`${apiURL}/categories/editCategory/${categoryId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: 'PUT',
            body: JSON.stringify(categoryBody),
        }).then((response) => {
            console.log(response.status)
            window.location.reload();
        });
    }

    const [showModals, setShowModals] = useState({});

    const handleShowForEdit = (categoryId, categoryName) => {
        setCategoryEdit(categoryName);
        setShowModals((prevShowModals) => ({
            ...prevShowModals,
            [categoryId]: true,
        }));
    };

    const handleCloseForEdit = (categoryId) => {
        setCategoryEdit('');
        setShowModals((prevShowModals) => ({
            ...prevShowModals,
            [categoryId]: false,
        }));
    };

    return (
        <>

            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                    <BackButton></BackButton>
                    <h3 className={"mb-0"}>Categories</h3>
                </div>
                <Button variant="dark" className={"mb-3 rounded-4 px-4 py-3"} onClick={handleShow}>
                    Add new category
                </Button>
            </div>
            <Row>
                {
                    categories ? (
                            categories.map((category) => (
                                <Col key={category.id} md={3}>
                                    <Card className={"mb-3 rounded-4 border-0 shadow-sm"}>
                                        <Card.Body>
                                            <h4 className={"me-3 mb-3"}>{category.name} </h4>
                                            <div className="d-flex align-items-center justify-content-between gap-3">
                                                <Button variant="warning" data-id={category.id}
                                                        onClick={() => handleShowForEdit(category.id, category.name)}
                                                        className={"w-100 rounded-4 px-4 py-3"}>Edit</Button>
                                                <Button variant="danger" data-id={category.id}
                                                        className={"w-100 rounded-4 px-4 py-3"}
                                                        onClick={() => deleteCategory(category.id)}>Delete</Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )))
                        : (<></>)
                }
            </Row>
            {
                categories ? (
                        categories.map((category) => (
                            <Modal key={category.id}
                                   show={showModals[category.id] || false}
                                   onHide={() => handleCloseForEdit(category.id)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Edit category</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Group className="mb-3" name={`nameEdit${category.id}`}
                                                    controlId={`exampleForm.nameEdit${category.id}`}>
                                            <Form.Label>Category Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                autoFocus
                                                value={categoryEdit}
                                                onChange={(e) => setCategoryEdit(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => handleCloseForEdit(category.id)}>
                                        Close
                                    </Button>
                                    <Button variant="primary" type="submit" onClick={() => editCategory(category.id)}>
                                        Save Changes
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        )))
                    : (<></>)
            }

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add new category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" name="name"

                                    controlId="exampleForm.name">
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Fashion"
                                autoFocus
                                onChange={(e) => setCategoryName(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit" onClick={handleSubmit}>Add category</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AdminRoute(ViewCategories);