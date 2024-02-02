import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import AddProductPage from "./routes/Products/AddProductPage.jsx";
import App from "./App.jsx";
import EditProductPage from "./routes/Products/EditProductPage.jsx";
import AddReviewPage from "./routes/Reviews/AddReviewPage.jsx";
import ViewProductPage from "./routes/Products/ViewProductPage.jsx";
import FavouriteProducts from "./routes/Products/FavouriteProducts.jsx";
import ShoppingCart from "./routes/Products/ShoppingCart.jsx";
import Login from "./routes/User/Login.jsx";
import Register from "./routes/User/Register.jsx";
import GeneralLayout from "./Layouts/GeneralLayout.jsx";
import AuthenticationLayout from "./Layouts/AuthenticationLayout.jsx";

// eslint-disable-next-line react-refresh/only-export-components

const router = createBrowserRouter([
    {
        path: "/",
        element: <GeneralLayout/>,
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
    },
    {
        path: "/user",
        element: <AuthenticationLayout/>,
        children: [
            {
                path: "/login",
                element: <Login/>,
            },
            {
                path: "/login",
                element: <Register/>,
            },
        ]
    }


]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
