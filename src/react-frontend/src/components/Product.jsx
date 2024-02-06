import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBoxesStacked, faCartShopping, faHeart} from "@fortawesome/free-solid-svg-icons";
import {Card, Col} from "react-bootstrap";
import StarRating from "./StarRating.jsx";

function Product({product, deleteProduct, saveAsFavourite, addToCart}) {
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
                        <Link to={`${product.id}`} className={"text-decoration-none text-dark"}>
                            <h4>{product.name}</h4>
                            <h5 className={"text-secondary"}><b>{product.price} Ron</b></h5>
                        </Link>
                        <StarRating
                            rating={product.rating}></StarRating>
                        <div id="product-stock" className={"py-1"}>
                            {
                                product.stock > 0 ? (
                                    <p className={"text-success m-0"}><FontAwesomeIcon icon={faBoxesStacked}
                                                                                       className={"me-1"}/> Available
                                        on
                                        stock</p>
                                ) : (<p className={"text-danger m-0"}><FontAwesomeIcon icon={faBoxesStacked}
                                                                                       className={"me-1"}/> Out of
                                    stock
                                </p>)
                            }
                        </div>
                        <div className={"d-flex justify-content-center w-100"}>
                            <div className="d-flex align-items-center">
                                     <span>
                                         <Button className={"me-2 py-2 p-0-5 rounded-4"}
                                                 style={{width: "210px"}}
                                                 variant={"dark "}
                                                 onClick={() => addToCart(product.id, product.price)}>
                                             Add to Cart
                                         <FontAwesomeIcon
                                             className={"ms-2 p-0-5"}
                                             size={"lg"}
                                             icon={faCartShopping}
                                         />
                                         </Button></span>
                                <span><Button variant="outline-danger" className={"border-2 py-2 rounded-4"}
                                              onClick={() => saveAsFavourite(product.id)}>
                                        <FontAwesomeIcon
                                            className={"p-0-5"}
                                            icon={faHeart}
                                            size={"xl"}/></Button></span>
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
