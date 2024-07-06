import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBoxesStacked, faHeart} from "@fortawesome/free-solid-svg-icons";
import {Badge, Card, Col} from "react-bootstrap";
import StarRating from "./StarRating.jsx";

function Product({product, saveAsFavourite, addToCart}) {
    return (
        <>
            <Col className={"d-flex align-items-stretch"} xl={3} lg={3} md={6} sm={6}>
                <Card
                    className={product.priceAfterDiscount ? "mb-4 p-2 shadow-discount border-2 border-danger-subtle rounded-4 w-100" : "mb-4 p-2 shadow-sm border-0 rounded-4 w-100"}>
                    {product.priceDiscount ? (
                        <Badge className={"fs-6 fw-medium rounded-pill px-3 py-2 bg-danger shadow-sm"}
                               style={{
                                   position: "absolute",
                                   right: "12px",
                                   top: "12px"
                               }}>-{product.priceDiscount}% discount</Badge>
                    ) : (<></>)}
                    {product.images[0] ? (
                        <Card.Img variant="top" height={"200px"}
                                  className={"p-2 rounded-4"}
                                  style={{objectFit: "cover", width: "100%"}}
                                  src={`data:image/jpeg;base64,${product.images[0].imageData}`}
                                  alt={product.images[0].name}/>) : <></>
                    }
                    <Card.Body>
                        <Link to={`/product/${product.id}`} className={"text-decoration-none text-dark"}>
                            <h4>{product.name}</h4>
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
                        </Link>
                        <StarRating
                            rating={product.rating}></StarRating>
                        <div id="product-stock" className={"py-1"}>
                            {
                                product.stock > 0 ? (
                                    <p className={"text-success mb-1"}><FontAwesomeIcon icon={faBoxesStacked}
                                                                                        className={"me-1"}/> Available
                                        on
                                        stock</p>
                                ) : (<p className={"text-danger mb-1"}><FontAwesomeIcon icon={faBoxesStacked}
                                                                                        className={"me-1"}/> Out of
                                    stock
                                </p>)
                            }
                        </div>
                        <div className={"d-flex justify-content-center w-100"}>
                            <div className="d-flex align-items-center w-100 gap-2">
                                <Button
                                    className={"py-3 p-0-5 rounded-4 d-flex align-items-center justify-content-center "}
                                    style={{width: "100%", height: 48.5}}
                                    variant={"dark "}
                                    onClick={product.priceAfterDiscount ? (() => addToCart(product.id, product.priceAfterDiscount)) : (() => addToCart(product.id, product.price))}>
                                    Add to Cart
                                    {/*<FontAwesomeIcon*/}
                                    {/*    className={"ms-2 p-0-5"}*/}
                                    {/*    size={"lg"}*/}
                                    {/*    icon={faCartShopping}*/}
                                    {/*/>*/}
                                </Button>
                                <Button variant="outline-danger" className={"border-2 py-2 rounded-4"}
                                        onClick={() => saveAsFavourite(product.id)}>
                                    <FontAwesomeIcon
                                        className={"p-0-5"}
                                        icon={faHeart}
                                        size={"xl"}/></Button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

            </Col>
        </>
    )
}

export default Product

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

{/*<span><Button variant="warning"><Link*/
}
{/*    to={`/editProducts/${product.id}`}>Edit</Link></Button></span>*/
}
{/*<span><Button variant="danger"*/
}
{/*              onClick={() => deleteProduct(product.id)}>Delete</Button></span>*/
}
