import React from "react";
import { Link, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./AdminNavbar.scss";
import {
    FaUserCircle,
    FaHome,
    FaUsers,
    FaCalendarAlt,
    FaShoppingCart,
    FaCheckCircle,
    FaGlobe,
    FaSignOutAlt,
    FaSmile
} from "react-icons/fa";

const AdminNavbar = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const handleLogout = async () => {
        try {
            await newRequest.post("/auth/logout");
            localStorage.setItem("currentUser", null);
            navigate("/login");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    if (!currentUser || !currentUser.isAdmin) {
        return null; // Don't render anything if not admin
    }

    return (
        <div className="admin-navbar">
            <div className="container">
                <div className="logo">
                    <Link to="/admin">
                        <img src="/img/img_3.png" alt="BlaBlaTripLogo" />
                        <span className="admin-text">Admin Panel</span>
                    </Link>
                </div>

                <div className="nav-links">
                    <Link to="/admin" className="nav-link">
                        <FaHome /> Dashboard
                    </Link>
                    <Link to="/admin/users" className="nav-link">
                        <FaUsers /> Users
                    </Link>
                    <Link to="/admin/gigs" className="nav-link">
                        <FaCalendarAlt /> Services
                    </Link>
                    <Link to="/admin/orders" className="nav-link">
                        <FaShoppingCart /> Orders
                    </Link>
                    <Link to="/admin/verifications" className="nav-link">
                        <FaCheckCircle /> Verifications
                    </Link>
                    <Link to="/admin/countries" className="nav-link">
                        <FaGlobe /> Countries
                    </Link>
                    <Link to="/admin/pois" className="nav-link">
                        <FaSmile /> Pois
                    </Link>
                </div>

                <div className="admin-actions">
                    <div className="admin-info">
                        <img src={currentUser.img || "/img/noavatar.jpg"} alt="Admin" />
                        <span>{currentUser?.username}</span>
                    </div>
                    <div className="action-buttons">
                        <Link to="/" className="site-link">Visit Site</Link>
                        <button className="logout-btn" onClick={handleLogout}>
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNavbar;