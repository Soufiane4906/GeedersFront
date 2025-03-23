import "./app.css";
import { createBrowserRouter, RouterProvider ,Outlet} from "react-router-dom";
import React, { Suspense, lazy } from 'react';
import Loading from './components/loading/Loading';
import Navbar from "./components/navbar/Navbar";
import Home from "./components/home/Home";
import Gigs from "./pages/gigs/Gigs";
import Gig from "./pages/gig/Gig";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Add from "./pages/add/Add";
import Orders from "./pages/orders/Orders";
import Messages from "./pages/messages/Messages";
import Message from "./pages/message/Message";
import MyGigs from "./pages/myGigs/MyGigs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Pay from "./pages/pay/Pay";
import Success from "./pages/success/Success";
import Profile from "./pages/profile/profile";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//botstrap
import './toastStyles.scss';


import 'bootstrap/dist/css/bootstrap.min.css';
import SingleOrder from "./pages/singleorder/SingleOrder";

function App() {
  const queryClient = new QueryClient();

  const Layout = () => (
    <div className="app">
      <QueryClientProvider client={queryClient}>
        {/* < Header /> */}
        <Navbar />
        <main>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </main>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </QueryClientProvider>
    </div>
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/gigs",
          element: <Gigs />,
        },
        // {
        //   path: "/users",
        //   element: <Users />,
        // },

        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/myGigs",
          element: <MyGigs />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        //singleorder
        {
          path: "/singleOrder/:id",
          element: <SingleOrder />,
          },
        {
          path: "/messages",
          element: <Messages />,
        },
        {
          path: "/message/:id",
          element: <Message />,
        },
        {
          path: "/add",
          element: <Add />,
        },
        {
          path: "/gig/:id",
          element: <Gig />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/pay/:id",
          element: <Pay />,
        },
        {
          path: "/success",
          element: <Success />,
        },

      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
