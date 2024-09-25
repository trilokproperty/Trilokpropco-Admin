import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../Component/Dashboard";
import AddProperty from "../Pages/AddProperty";
import Root from "../Pages/Root";
import Properties from "../Pages/Properties";
import Developer from "../Pages/Developer";
import Type from "../Pages/Type";
import Status from "../Pages/Status";
import Amenities from "../Pages/Amenities";
import BlogCategories from "../Pages/BlogCategories";
import AddBlog from "../Pages/AddBlog";
import BlogsLists from "../Pages/BlogsLists";
import Cities from "../Pages/City";
import Testimonials from "../Pages/Testimonials";
import Partners from "../Pages/Partners";
import Footer from "../Pages/Footer";
import Inquiries from "../Pages/Inquiries";
import About from "../Pages/About";
import WhyUs from "../Pages/WhyUs";
import Services from "../Pages/Services";
import SignUp from "../Pages/SignUp";
import LogIn from "../Pages/LogIn";
import PrivateRoute from "./privateRoute";
import User from "../Pages/User";
import { endPoint } from "../../forAll/forAll";
import ChangePass from "../Pages/ChangePass";


export const router = createBrowserRouter([

    {
        path:"/",
        element: <Dashboard/>,
        errorElement:<h1>Error</h1>,
        children:[
            {
                path:'/',
                element:<PrivateRoute><Root /></PrivateRoute>
            },
            {
                path:'add',
                element:<PrivateRoute><AddProperty /></PrivateRoute>
            },
            {
                path:'properties',
                element:<PrivateRoute><Properties /></PrivateRoute>
            },
            {
                path:'developer',
                element:<PrivateRoute><Developer /></PrivateRoute>
            },
            {
                path:'type',
                element:<PrivateRoute><Type /></PrivateRoute>
            },
            {
                path:'status',
                element:<PrivateRoute><Status /></PrivateRoute>
            },
            {
                path:'amenities',
                element:<PrivateRoute><Amenities /></PrivateRoute>
            },
            {
                path:'cities',
                element:<PrivateRoute><Cities /></PrivateRoute>
            },
            
            {
                path:'about',
                element:<PrivateRoute><About /></PrivateRoute>
            },
            
            {
                path:'why',
                element:<PrivateRoute><WhyUs /></PrivateRoute>
            },
            {
                path:'services',
                element:<PrivateRoute><Services /></PrivateRoute>
            },
            {
                path:'addBlog',
                element:<PrivateRoute><AddBlog /></PrivateRoute>
            },
            {
                path:'blogs',
                element:<PrivateRoute><BlogsLists /></PrivateRoute>
            },
            {
                path:'blogCategories',
                element:<PrivateRoute><BlogCategories /></PrivateRoute>
            },
            {
                path:'testimonials',
                element:<PrivateRoute><Testimonials /></PrivateRoute>
            },
            {
                path:'partners',
                element:<PrivateRoute><Partners /></PrivateRoute>
            },
            {
                path:'inquiries',
                element:<PrivateRoute><Inquiries /></PrivateRoute>
            },
            {
                path:'user',
                element:<PrivateRoute><User /></PrivateRoute>
            },
            {
                path:'footer',
                element:<PrivateRoute><Footer /></PrivateRoute>
            },
            {
                path: 'changepass/:id',
                element: <ChangePass />,
                loader: ({ params }) => fetch(`${endPoint}/user/${params._id}`)
              },
        ]
    },
    {
        path:'signup',
        element:<SignUp />
    },
    {
        path:'login',
        element:<LogIn />
    },
])