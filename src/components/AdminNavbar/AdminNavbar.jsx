import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
    FaSmile,
    FaLanguage,
    FaBars,
    FaTimes,
    FaBell,
    FaCog
} from "react-icons/fa";

const AdminNavbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const mobileMenuRef = useRef(null);
    const notificationsRef = useRef(null);
    const userMenuRef = useRef(null);

    const navigate = useNavigate();
    const { pathname } = useLocation();

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Fermer les menus lors du changement de route
    useEffect(() => {
        setMobileMenuOpen(false);
        setNotificationsOpen(false);
        setUserMenuOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        try {
            await newRequest.post("/auth/logout");
            localStorage.setItem("currentUser", null);
            navigate("/login");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    // Gestion des clics à l'extérieur des menus
    const handleClickOutside = (e) => {
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) &&
            !e.target.closest('.mobile-toggle')) {
            setMobileMenuOpen(false);
        }

        if (notificationsRef.current && !notificationsRef.current.contains(e.target) &&
            !e.target.closest('.notifications-toggle')) {
            setNotificationsOpen(false);
        }

        if (userMenuRef.current && !userMenuRef.current.contains(e.target) &&
            !e.target.closest('.user-menu-toggle')) {
            setUserMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Gestion des touches d'accessibilité
    const handleKeyDown = (e, action) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            action();
        }
        if (e.key === 'Escape') {
            setMobileMenuOpen(false);
            setNotificationsOpen(false);
            setUserMenuOpen(false);
        }
    };

    if (!currentUser || !currentUser.isAdmin) {
        return null; // Ne rien afficher si l'utilisateur n'est pas admin
    }

    // Liens de navigation admin
    const navLinks = [
        { path: "/admin", icon: <FaHome />, text: "Dashboard" },
        { path: "/admin/users", icon: <FaUsers />, text: "Utilisateurs" },
        { path: "/admin/gigs", icon: <FaCalendarAlt />, text: "Services" },
        { path: "/admin/orders", icon: <FaShoppingCart />, text: "Commandes" },
        { path: "/admin/verifications", icon: <FaCheckCircle />, text: "Vérifications" },
        { path: "/admin/countries", icon: <FaGlobe />, text: "Pays" },
        { path: "/admin/pois", icon: <FaSmile />, text: "POIs" },
        { path: "/admin/languages", icon: <FaLanguage />, text: "Langues" }
    ];

    // Notifications factices
    const notifications = [
        { id: 1, text: "Nouvelle demande de vérification", time: "Il y a 5 min" },
        { id: 2, text: "10 nouvelles inscriptions aujourd'hui", time: "Il y a 2h" },
        { id: 3, text: "Mise à jour système disponible", time: "Il y a 1j" }
    ];

    return (
        <div className="admin-navbar">
            <div className="container">
                <div className="left-section">
                    <button
                        className="mobile-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-expanded={mobileMenuOpen}
                        aria-label="Menu de navigation"
                    >
                        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>

                    <div className="logo">
                        <Link to="/admin">
                            <img src="/img/img_3.png" alt="BlaBlaTripLogo" />
                            <span className="admin-text">Admin Panel</span>
                        </Link>
                    </div>
                </div>

                <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`} ref={mobileMenuRef}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-link ${pathname === link.path ? 'active' : ''}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.icon} <span>{link.text}</span>
                        </Link>
                    ))}
                </nav>

                <div className="admin-actions">
                    <div
                        className="notifications-toggle"
                        onClick={() => setNotificationsOpen(!notificationsOpen)}
                        onKeyDown={(e) => handleKeyDown(e, () => setNotificationsOpen(!notificationsOpen))}
                        tabIndex="0"
                        role="button"
                        aria-haspopup="true"
                        aria-expanded={notificationsOpen}
                    >
                        <FaBell />
                        <span className="notification-badge">3</span>

                        {notificationsOpen && (
                            <div className="notifications-dropdown" ref={notificationsRef}>
                                <div className="dropdown-header">
                                    <h3>Notifications</h3>
                                    <button className="mark-all">Tout marquer comme lu</button>
                                </div>
                                <div className="notifications-list">
                                    {notifications.map(notification => (
                                        <div key={notification.id} className="notification-item">
                                            <div className="notification-content">
                                                <p>{notification.text}</p>
                                                <span className="notification-time">{notification.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="dropdown-footer">
                                    <Link to="/admin/notifications">Voir toutes les notifications</Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <Link to="/admin/settings" className="settings-link">
                        <FaCog />
                    </Link>

                    <div className="admin-user">
                        <div
                            className="user-menu-toggle"
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            onKeyDown={(e) => handleKeyDown(e, () => setUserMenuOpen(!userMenuOpen))}
                            tabIndex="0"
                            role="button"
                            aria-haspopup="true"
                            aria-expanded={userMenuOpen}
                        >
                            <img src={currentUser.img || "/img/noavatar.jpg"} alt="Admin" />
                            <span className="username">{currentUser?.username}</span>

                            {userMenuOpen && (
                                <div className="user-dropdown" ref={userMenuRef}>
                                    <Link to="/profile" className="dropdown-item">
                                        <FaUserCircle /> Mon profil
                                    </Link>
                                    <Link to="/admin/settings" className="dropdown-item">
                                        <FaCog /> Paramètres
                                    </Link>
                                    <div className="dropdown-divider"></div>
                                    <Link to="/" className="dropdown-item">
                                        <FaHome /> Retour au site
                                    </Link>
                                    <button className="dropdown-item logout" onClick={handleLogout}>
                                        <FaSignOutAlt /> Déconnexion
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay pour mobile */}
            {mobileMenuOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminNavbar;
