import {Link} from "react-router-dom";
import {Badge, Card, Col} from "react-bootstrap";
import Button from "react-bootstrap/Button";

function ProductAdmin({product, deleteProduct}) {
    return (
        <>
            <Col className={""} xl={3} md={4} sm={6}>
                <Card className={"mb-4 p-2 shadow-sm border-0 rounded-4"}>

                    {product.images[0] ? (
                        <Card.Img variant="top" height={"200px"}
                                  className={"p-2 rounded-4"}
                                  style={{objectFit: "cover", width: "100%"}}
                                  src={`data:image/jpeg;base64,${product.images[0].imageData}`}
                                  alt={product.images[0].name}/>) : <></>
                    }
                    <Card.Body>
                        <h4>{product.name}</h4>
                        <div id="product-stock" className={"py-1"}>
                            {
                                product.priceAfterDiscount ? (<>
                                        <span
                                            className={"text-danger fs-5 fw-semibold me-2"}>{product.priceAfterDiscount} RON</span>
                                        <span
                                            className={"text-secondary text-decoration-line-through fs-7 me-2"}>{product.price} RON</span>
                                        <Badge
                                            className={"bg-danger fw-medium rounded-pill"}>-{product.priceDiscount}%</Badge></>)
                                    : (
                                        <h5 className={"text-secondary"}>
                                            <b>{product.price} RON</b></h5>)
                            }
                        </div>
                        <div className={"d-flex justify-content-center w-100 mt-2"}>
                            <div className="d-flex align-items-center justify-content-between gap-2 w-100">
                                <Button variant="warning"
                                        className={"rounded-4 px-4 py-3 w-100"}><Link
                                    className={"text-decoration-none text-dark"}
                                    to={`/editProducts/${product.id}`}>Edit</Link></Button>
                                <Button variant="danger" className={"rounded-4 px-4 py-3 w-100"}
                                        onClick={() => deleteProduct(product.id)}>Delete</Button>

                            </div>
                        </div>
                    </Card.Body>
                </Card>

            </Col>
        </>
    )
}

export default ProductAdmin

{/*ALL IMAGES*/
}
{/*{*/
}
{/*    product.images ? (*/
}
{/*        product.images.map((image) => (*/
}
{/*            <img height="100px" width="100px" key={image.id}*/
}
{/*                 src={`data:image/jpeg;base64,${image.imageData}`}*/
}
{/*                 alt={image.name}/>*/
}
{/*        ))*/
}

{/*    ) : <></>*/
}
{/*}*/
}

{/*{product.images[0] ?*/
}
{/*    (<img height="100px" width="100px" key={product.images[0].id}*/
}
{/*          src={`data:image/jpeg;base64,${product.images[0].imageData}`}*/
}
{/*          alt={product.images[0].name}/>) : <></>*/
}
{/*}*/
}

