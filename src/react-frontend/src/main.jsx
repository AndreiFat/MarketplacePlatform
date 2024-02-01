import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, Outlet, RouterProvider,} from "react-router-dom";
import AddProductPage from "./routes/Products/AddProductPage.jsx";
import App from "./App.jsx";
import EditProductPage from "./routes/Products/EditProductPage.jsx";
import AddReviewPage from "./routes/Reviews/AddReviewPage.jsx";
import ViewProductPage from "./routes/Products/ViewProductPage.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import {Container} from "react-bootstrap";
import FavouriteProducts from "./routes/Products/FavouriteProducts.jsx";
import ShoppingCart from "./routes/Products/ShoppingCart.jsx";

// eslint-disable-next-line react-refresh/only-export-components
const Layout = () => {
    return (
        <>
            <Container fluid className={"p-0"}>
                <Header/>
                <Container>
                    <Outlet/>
                </Container>
                <Footer/>
            </Container>
        </>
    )
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            {
                path: "/",
                element: <App/>,
            },
            {
                path: "/addingProducts",
                element: <AddProductPage/>,
            },
            {
                path: "/editProducts/:productId",
                element: <EditProductPage/>,
            },
            {
                path: "/:productId/addReview",
                element: <AddReviewPage/>,
            },
            {
                path: "/:productId",
                element: <ViewProductPage/>,
            },
            {
                path: "/favourite-products",
                element: <FavouriteProducts/>
            },
            {
                path: "/shopping-cart",
                element: <ShoppingCart/>
            },
        ]
    }

]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
