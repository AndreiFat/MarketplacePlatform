import AdminRoute from "../../Utilities/AdminRoute.jsx";
import {useState} from "react";
import {useLocalState} from "../../Utilities/useLocalState.js";
import Button from "react-bootstrap/Button";
import {Card, Col, Form, Modal, Row} from "react-bootstrap";
import BackButton from "../../components/BackButton.jsx";

function ViewDiscountCoupons() {
    const apiURL = import.meta.env.VITE_API_URL;
    const [discountCoupons, setDiscountCoupons] = useState(null);
    const [jwt, setJwt] = useLocalState("", "jwt");

    const [categories, setCategories] = useState(null);   //categoriile legate de codurile de discount
    const [categoryId, setCategoryId] = useState("");
    const [discountCode, setDiscountCode] = useState("");
    const [discountValue, setDiscountValue] = useState("");

    const [discountCouponCodeEdit, setDiscountCouponCodeEdit] = useState("");
    const [discountCouponValueEdit, setDiscountCouponValueEdit] = useState("");
    const [discountCouponCategoryIdEdit, setDiscountCouponCategoryIdEdit] = useState("");

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // fetch pentru cuponuri si pentru categorii
    useState(() => {
        fetch(`${apiURL}/discountCoupons/viewCoupons`, {
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
            .then((discountCouponsData) => {
                setDiscountCoupons(discountCouponsData);
                console.log(discountCouponsData);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });


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
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedCategoryIndex = categories !== null ? categories.findIndex(category => category.id === parseInt(categoryId, 10)) : -1;
        console.log(selectedCategoryIndex);

        const discountCouponToAdd = {
            code: discountCode,
            discount: discountValue,
            categoryId: {
                id: parseInt(categoryId),
                name: categories[selectedCategoryIndex].name
            }
        };

        console.log(discountCouponToAdd);

        fetch(`${apiURL}/discountCoupons/addCoupon`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: 'POST',
            body: JSON.stringify(discountCouponToAdd)
        }).then((response) => response.json())
            .then((discountCoupon) => {
                console.log(discountCoupon);
                window.location.reload();
            });
    }

    function deleteDiscountCoupon(discountCouponId) {
        fetch(`${apiURL}/discountCoupons/deleteCoupon/${discountCouponId}`, {
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
                console.error('Error deleting discount coupon:', error);
            });
    }

    function editCategory(discountCouponId, e) {
        const selectedCategoryIndex = categories !== null ? categories.findIndex(category => category.id === parseInt(discountCouponCategoryIdEdit, 10)) : -1;
        console.log("Test")
        console.log(selectedCategoryIndex);
        console.log(discountCouponId)

        const discountCouponBody = {
            code: discountCouponCodeEdit,
            discount: discountCouponValueEdit,
            categoryId: {
                id: parseInt(discountCouponCategoryIdEdit),
                // name: categories[selectedCategoryIndex].name
            }
        };


        fetch(`${apiURL}/discountCoupons/editCoupon/${discountCouponId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: 'PUT',
            body: JSON.stringify(discountCouponBody),
        }).then((response) => {
            console.log(response.status)
            window.location.reload();
        });
    }

    const [showModals, setShowModals] = useState({});

    const handleShowForEdit = (discountId, discountCode, discountValue, discountCategory) => {
        setDiscountCouponCodeEdit(discountCode);
        setDiscountCouponValueEdit(discountValue);
        setDiscountCouponCategoryIdEdit(discountCategory)
        setShowModals((prevShowModals) => ({
            ...prevShowModals,
            [discountId]: true,
        }));
    };

    const handleCloseForEdit = (discountId) => {
        setDiscountCouponCodeEdit("");
        setDiscountCouponValueEdit("");
        //setDiscountCouponCategoryIdEdit("");
        setShowModals((prevShowModals) => ({
            ...prevShowModals,
            [discountId]: false,
        }));
    };


    return (
        <>
            <div className="d-flex justify-content-between align-items-center pt-3">
                <div className={"d-flex align-items-center gap-3"}>
                    <BackButton></BackButton>
                    <h3 className={"mb-0"}>Discount Coupons</h3>
                </div>
                <Button variant="dark" className={"px-4 py-3 rounded-4"} onClick={handleShow}>
                    Add new coupon
                </Button>
            </div>
            <Row className={"mt-3"}>
                {
                    (discountCoupons && discountCoupons.length !== 0) ? (
                            discountCoupons.map((discountCoupon) => (
                                <Col md={3} key={discountCoupon.id}>
                                    <Card className={"rounded-4 border-0 shadow-sm"}>
                                        <Card.Body className={"p-4"}>
                                            <div className="mb-3">
                                                <h3>{discountCoupon.code}</h3>
                                                <h5>Value: <span className={"fw-normal"}>{discountCoupon.discount}</span>
                                                </h5>
                                                <h5>Category: <span
                                                    className={"fw-normal"}>{discountCoupon.categoryId.name}</span></h5>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center gap-3">
                                                <Button variant="warning" className={"px-4 py-3 rounded-4 w-100"}
                                                        data-id={discountCoupon.id}
                                                        onClick={() => handleShowForEdit(discountCoupon.id, discountCoupon.code, discountCoupon.discount, discountCoupon.categoryId.id)}>Edit
                                                </Button>
                                                <Button variant="danger" className={"px-4 py-3 rounded-4 w-100"}
                                                        data-id={discountCoupon.id}
                                                        onClick={() => deleteDiscountCoupon(discountCoupon.id)}>Delete
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>

                            )))
                        : (<><h6 className={"my-3"}>No coupon code created yet!</h6></>)
                }
            </Row>
            {
                discountCoupons ? (
                        discountCoupons.map((discountCoupon) => (
                            <Modal key={discountCoupon.id}
                                   show={showModals[discountCoupon.id] || false}
                                   onHide={() => handleCloseForEdit(discountCoupon.id)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Edit discount coupon</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Group className="mb-3" name={`codeEdit${discountCoupon.id}`}
                                                    controlId={`exampleForm.codeEdit${discountCoupon.id}`}>
                                            <Form.Label>Discount Code</Form.Label>
                                            <Form.Control
                                                type="text"
                                                autoFocus
                                                value={discountCouponCodeEdit}
                                                onChange={(e) => setDiscountCouponCodeEdit(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" name={`valueEdit${discountCoupon.id}`}
                                                    controlId={`exampleForm.valueEdit${discountCoupon.id}`}>
                                            <Form.Label>Discount Value</Form.Label>
                                            <Form.Control
                                                type="number"
                                                autoFocus
                                                value={discountCouponValueEdit}
                                                onChange={(e) => setDiscountCouponValueEdit(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" name="categoryIdEdit"
                                                    controlId="exampleForm.categoryIdEdit">
                                            <Form.Label>Category</Form.Label>
                                            <select name="categoryIdEdit" value={discountCouponCategoryIdEdit}
                                                    onChange={(e) => setDiscountCouponCategoryIdEdit(e.target.value)}>
                                                <option value="">Select option</option>
                                                {categories !== null && categories.map(category => (
                                                    <option key={category.id} value={category.id}
                                                            data-array={categories.indexOf(category)}>
                                                        {category.name}
                                                    </option>
                                                ))}

                                            </select>
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => handleCloseForEdit(discountCoupon.id)}>
                                        Close
                                    </Button>
                                    <Button variant="primary" type="submit" onClick={() => editCategory(discountCoupon.id)}>
                                        Save Changes
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        )))
                    : (<></>)
            }

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add new coupon</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" name="discountCode"
                                    controlId="exampleForm.discountCode">
                            <Form.Label>Discount Code: </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="FASHION25"
                                autoFocus
                                onChange={(e) => setDiscountCode(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" name="discountValue"
                                    controlId="exampleForm.discountValue">
                            <Form.Label>Discount Value: </Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="25"
                                autoFocus
                                onChange={(e) => setDiscountValue(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" name="categoryId" value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    controlId="exampleForm.categoryId">
                            <Form.Label>Category</Form.Label>
                            <select name="categoryId" value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}>
                                <option value="">Select Category</option>
                                {categories !== null && categories.map(category => (
                                    <option key={category.id} value={category.id}
                                            data-array={categories.indexOf(category)}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit"
                            onClick={handleSubmit}>Add category</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AdminRoute(ViewDiscountCoupons);