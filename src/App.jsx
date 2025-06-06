import "./app.css";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
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
import Profile from "./pages/profile/Profile.jsx";
import AboutUs from "./pages/about/AboutUs.jsx";
import Services from "./pages/services/Services.jsx";
import Contact from "./pages/contact/Contact.jsx";
import Terms from "./pages/legal/Terms.jsx";
import Privacy from "./pages/legal/Privacy.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toastStyles.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import SingleOrder from "./pages/singleorder/SingleOrder";

// Import Protected Routes
import { ProtectedUserRoute, ProtectedAdminRoute } from "./components/ProtectedRoute";

// Admin components
import AdminNavbar from "./components/AdminNavbar/AdminNavbar";
import AdminDashboard from "./pages/Admin/dashboard/AdminDashboard";
import AdminGigs from "./pages/Admin/gigs/AdminGigs";
import AdminUsers from "./pages/Admin/users/AdminUsers";
import AdminGigDetails from "./pages/Admin/gigs/AdminGigDetails";
import AdminGigEdit from "./pages/Admin/gigs/AdminGigEdit";
import AdminUserDetails from "./pages/Admin/users/AdminUserDetails";
import AdminOrders from "./pages/Admin/orders/AdminOrders";
import AdminOrderDetails from "./pages/Admin/orders/AdminOrderDetails";
import AdminVerifications from "./pages/Admin/verifications/AdminVerifications";
import AdminCountries from "./pages/Admin/countries/AdminCountries";
import AdminPOIs from "./pages/Admin/pois/AdminPOIs.jsx";
import DiscoverMoreStories from "./pages/Stories/DiscoverMoreStories.jsx";
import ShareStoryPage from "./pages/Stories/ShareStoryPage.jsx";
import AdminLanguages from "./pages/Admin/languages/AdminLanguages.jsx";

// Page 404 (Not Found)
import NotFound from "./pages/notFound/NotFound";

function App() {
  const queryClient = new QueryClient();

  const Layout = () => (
      <div className="app">
        <QueryClientProvider client={queryClient}>
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

  // Admin layout with the dedicated admin navbar
  const AdminLayout = () => (
      <div className="app admin-app">
        <QueryClientProvider client={queryClient}>
          <AdminNavbar />
          <main className="admin-main">
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </main>
          <ToastContainer position="bottom-right" autoClose={3000} />
        </QueryClientProvider>
      </div>
  );

  const router = createBrowserRouter([
    // Public routes (accessible to all)
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
          path: "/about",
          element: <AboutUs />,
        },
        {
          path: "/services",
          element: <Services />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
        {
          path: "/terms",
          element: <Terms />,
        },
        {
          path: "/privacy",
          element: <Privacy />,
        },
        {
          path: "/stories",
          element: <DiscoverMoreStories />
        },
        {
          path: "/share-story",
          element: <ShareStoryPage />
        }
      ],
    },
    // Protected user routes (accessible only to regular users)
    {
      path: "/user",
      element: <ProtectedUserRoute />,
      children: [
        {
          path: "",
          element: <Layout />,
          children: [
            {
              path: "profile",
              element: <Profile />,
            },
            {
              path: "myGigs",
              element: <MyGigs />,
            },
            {
              path: "orders",
              element: <Orders />,
            },
            {
              path: "singleOrder/:id",
              element: <SingleOrder />,
            },
            {
              path: "messages",
              element: <Messages />,
            },
            {
              path: "message/:id",
              element: <Message />,
            },
            {
              path: "add",
              element: <Add />,
            },
            {
              path: "pay/:id",
              element: <Pay />,
            },
            {
              path: "success",
              element: <Success />,
            },
          ],
        },
      ],
    },
    // Protected admin routes (accessible only to admins)
    {
      path: "/admin",
      element: <ProtectedAdminRoute />,
      children: [
        {
          path: "",
          element: <AdminLayout />,
          children: [
            {
              path: "",
              element: <AdminDashboard />,
            },
            {
              path: "users",
              element: <AdminUsers />,
            },
            {
              path: "users/:userId",
              element: <AdminUserDetails />,
            },
            {
              path: "gigs",
              element: <AdminGigs />,
            },
            {
              path: "gigs/:id",
              element: <AdminGigDetails />,
            },
            {
              path: "gigs/:id/edit",
              element: <AdminGigEdit />,
            },
            {
              path: "orders",
              element: <AdminOrders />,
            },
            {
              path: "orders/:id",
              element: <AdminOrderDetails />,
            },
            {
              path: "verifications",
              element: <AdminVerifications />,
            },
            {
              path: "countries",
              element: <AdminCountries />,
            },
            {
              path: "pois",
              element: <AdminPOIs />
            },
            {
              path: "languages",
              element: <AdminLanguages />
            },
            // Ajout des routes utilisateur pour les admins
            {
              path: "profile",
              element: <Profile />,
            },
            {
              path: "messages",
              element: <Messages />,
            },
            {
              path: "message/:id",
              element: <Message />,
            },
            {
              path: "add",
              element: <Add />,
            },
            {
              path: "myGigs",
              element: <MyGigs />,
            }
          ],
        },
      ],
    },
    // Redirects for old routes
    {
      path: "/profile",
      element: <Navigate to="/user/profile" replace />,
    },
    {
      path: "/myGigs",
      element: <Navigate to="/user/myGigs" replace />,
    },
    {
      path: "/orders",
      element: <Navigate to="/user/orders" replace />,
    },
    {
      path: "/singleOrder/:id",
      element: <Navigate to="/user/singleOrder/:id" replace />,
    },
    {
      path: "/messages",
      element: <Navigate to="/user/messages" replace />,
    },
    {
      path: "/message/:id",
      element: <Navigate to="/user/message/:id" replace />,
    },
    {
      path: "/add",
      element: <Navigate to="/user/add" replace />,
    },
    {
      path: "/pay/:id",
      element: <Navigate to="/user/pay/:id" replace />,
    },
    {
      path: "/success",
      element: <Navigate to="/user/success" replace />,
    },
    // Page 404 - doit être la dernière route
    {
      path: "*",
      element: <Layout />,
      children: [
        {
          path: "*",
          element: <NotFound />
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
