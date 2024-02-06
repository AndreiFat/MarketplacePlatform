import Carousel from 'react-bootstrap/Carousel';


function HomePageCarousel() {
    return (
        <Carousel style={{height: "650px"}} className={"mb-4"}>
            <Carousel.Item interval={2000} style={{height: "650px"}}>
                <img style={{objectFit: "cover", height: "100%", width: "100%"}} src="./src/assets/sales1.png"
                     className={"image-overlay"}
                     alt=""/>
                <Carousel.Caption>
                    <h2>Limited Time Offer</h2>
                    <p>Get 20% Off on All Home Appliances!</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={2000} style={{height: "650px"}}>
                <img style={{objectFit: "cover", height: "100%", width: "100%"}} src="./src/assets/sales2.png"
                     alt=""/>
                <Carousel.Caption>
                    <h2>Act Fast! Don't Miss Our 24-Hour Flash Sale - Huge Discounts Await!</h2>
                    <p>Get 20% Extra if buy from fashion category</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={2000} style={{height: "650px"}}>
                <img style={{objectFit: "cover", height: "100%", width: "100%"}} src="./src/assets/sales3.png"
                     alt=""/>
                <Carousel.Caption>
                    <h2>Unlock Big Savings with Our Bundle Deals</h2>
                    <p> Buy More, Save More Today!</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}

export default HomePageCarousel;