// ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

// For regular user routes - redirects admins to admin dashboard
export const ProtectedUserRoute = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // If no user is logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If user is admin, redirect to admin dashboard
  if (currentUser.isAdmin) {
    return <Navigate to="/admin" />;
  }

  // Otherwise, show the user route
  return <Outlet />;
};

// For admin routes - redirects non-admins to home page
export const ProtectedAdminRoute = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // If no user is logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If user is not admin, redirect to home
  if (!currentUser.isAdmin) {
    return <Navigate to="/" />;
  }

  // Otherwise, show the admin route
  return <Outlet />;
};