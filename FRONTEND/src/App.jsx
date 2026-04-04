import './App.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import RootLayout from "./RootLayout.jsx";
import Register from "./pages/register.jsx";
import Login from "./pages/login.jsx";
import {Provider} from "react-redux";
import  store  from "./store/store.js";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Interview from "./pages/Interview.jsx";
import AllInterviews from "./pages/AllInterviews.jsx";
import ChooseInterview from "./pages/ChooseInterview.jsx";


function App() {
    const router = createBrowserRouter([
        {
            element: <RootLayout/>,
            path: "/",
            children: [
                {
                    element: <Home/>,
                    path: "/",
                },
                {
                    element: <Register/>,
                    path: "/register",
                },
                {
                    element: <Login/>,
                    path: "/login",
                },
                {
                    element: <ProtectedRoute><Dashboard/></ProtectedRoute>,
                    path: "/dashboard",
                },
                {
                    element: <ProtectedRoute><Interview/></ProtectedRoute>,
                    path: "/interview",
                },
                {
                    element: <ProtectedRoute><AllInterviews/></ProtectedRoute>,
                    path: "/all-interviews",
                },
                {
                    element: <ProtectedRoute><ChooseInterview/></ProtectedRoute>,
                    path: "/interview/:interviewId",
                },

            ]
        }
    ])

    return (
        <Provider store={store}>
            <RouterProvider router={router}/>
        </Provider>

    )
}

export default App
