import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import AddProductPage from "./routes/Products/AddProductPage.jsx";
import App from "./App.jsx";
import EditProductPage from "./routes/Products/EditProductPage.jsx";
import AddReviewPage from "./routes/Reviews/AddReviewPage.jsx";
import ViewProductPage from "./routes/Products/ViewProductPage.jsx";

const router = createBrowserRouter([
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
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
