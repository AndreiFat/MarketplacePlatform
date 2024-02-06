import Carousel from 'react-bootstrap/Carousel';


function ProductCarousel({images}) {
    return (
        <Carousel style={{height: "420px"}} className={"rounded-4"} variant={"dark"}>
            {
                images ? (
                    images.map((image) => (
                        <Carousel.Item className={"rounded-3"} key={image.id} style={{height: "420px"}}>
                            <img style={{objectFit: "cover", height: "100%", width: "100%"}}
                                 src={`data:image/jpeg;base64,${image.imageData}`}
                                 alt={image.name}
                            />
                        </Carousel.Item>
                    ))

                ) : (<></>)
            }

        </Carousel>
    );
}

export default ProductCarousel;