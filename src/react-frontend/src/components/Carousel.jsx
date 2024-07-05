import Carousel from 'react-bootstrap/Carousel';


function HomePageCarousel() {
    const carouselSize = '350px';
    return (
        <Carousel style={{height: `${carouselSize}`}} className={"w-75"}>
            <Carousel.Item interval={2000} style={{height: `${carouselSize}`}} className={"carousel-item-container"}>
                <div className="image-carousel">
                    <img style={{
                        backgroundSize: "cover",
                        width: "100%", backgroundRepeat: "no-repeat",
                        backgroundPosition: "center"
                    }} src="./src/assets/sales1.jpg"
                         className={"image-overlay"}
                         alt=""/>
                </div>
                <Carousel.Caption>
                    <h4>Limited Time Offer</h4>
                    <p>Get 20% Off on All Home Appliances!</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={2000} style={{height: `${carouselSize}`}}>
                <div className="image-carousel">
                    <img style={{
                        backgroundSize: "cover", width: "100%",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "top"
                    }} src="./src/assets/sales2.jpg"
                         alt=""/>
                </div>
                <Carousel.Caption>
                    <h4>Act Fast! Don't Miss Our 24-Hour Flash Sale - Huge Discounts Await!</h4>
                    <p>Get 20% Extra if buy from fashion category</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={2000} style={{height: `${carouselSize}`}}>
                <div className="image-carousel">
                    <img style={{
                        backgroundSize: "cover", width: "100%", backgroundRepeat: "no-repeat",
                        backgroundPosition: "center"
                    }} src="./src/assets/sales3.jpg"
                         alt=""/>
                </div>
                <Carousel.Caption>
                    <h4>Unlock Big Savings with Our Bundle Deals</h4>
                    <p> Buy More, Save More Today!</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={2000} style={{height: `${carouselSize}`}}>
                <div className="image-carousel">
                    <img style={{
                        backgroundSize: "cover",
                        width: "100%",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center"
                    }} src="./src/assets/sales4.jpg"
                         alt=""/>
                </div>
                <Carousel.Caption>
                    <h4>Unlock Big Savings with Our Bundle Deals</h4>
                    <p> Buy More, Save More Today!</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}

export default HomePageCarousel;