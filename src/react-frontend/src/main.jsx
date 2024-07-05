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
import ViewCategories from "./routes/Categories/ViewCategories.jsx";
import ViewDiscountCoupons from "./routes/DiscountCoupons/ViewDiscountCoupons.jsx";
import AccountSettings from "./routes/User/AccountSettings.jsx";
import ManageAddresses from "./routes/Addresses/ManageAddresses.jsx";
import HomepageAdmin from "./Admin/HomepageAdmin.jsx";
import ManageUsers from "./routes/User/ManageUsers.jsx";
import ManageOrders from "./Orders/ManageOrders.jsx";
import Orders from "./routes/User/Orders.jsx";
import AdminLayout from "./Layouts/AdminLayout.jsx";
import SearchProducts from "./routes/Products/SearchProducts.jsx";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import ManagePayment from "./routes/Payments/ManagePayment.jsx";
import ProductsInCategory from "./routes/Products/ProductsInCategory.jsx";
import CancelOrder from "./routes/Payments/CancelOrder.jsx";

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
            {
                path: "/accountSettings",
                element: <AccountSettings/>
            },
            // {
            //     path: "/addresses",
            //     element: <ManageAddresses/>
            // },
            {
                path: "/user/manageOrders",
                element: <Orders/>
            },
            {
                path: "/search",
                element: <SearchProducts/>
            },
            {
                path: "/success",
                element: <ManagePayment/>
            },
            {
                path: "/cancelOrder",
                element: <CancelOrder/>
            },
            {
                path: "/productsInCategory/:categoryId",
                element: <ProductsInCategory/>
            },
        ]
    },
    {
        path: "/",
        element: <AuthenticationLayout/>,
        children: [
            {
                path: "/login",
                element: <Login/>,
            },
            {
                path: "/register",
                element: <Register/>,
            },
            {
                path: "/addresses",
                element: <ManageAddresses/>
            }
        ]

    },
    {
        path: "/",
        element: <AdminLayout/>,
        children: [
            {
                path: "/admin",
                element: <HomepageAdmin/>,
            },
            // {
            //     path: "/viewProducts",
            //     element: <HomepageAdmin/>,
            // },
            {
                path: "/admin/manageOrders",
                element: <ManageOrders/>
            },
            {
                path: "/admin/manageUsers",
                element: <ManageUsers/>
            },
            {
                path: "/admin/manageCategories",
                element: <ViewCategories/>
            },
            {
                path: "/admin/manageDiscountCoupons",
                element: <ViewDiscountCoupons/>
            },
            {
                path: "/addingProducts",
                element: <AddProductPage/>
            }
        ]
    }


]);
const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_API_KEY}`);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Elements stripe={stripePromise}>
            <RouterProvider router={router}/>
        </Elements>
    </React.StrictMode>,
)
