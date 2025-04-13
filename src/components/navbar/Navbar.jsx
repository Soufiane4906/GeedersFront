import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Navbar.scss";
import {
  FaUserCircle, FaCalendarAlt, FaPlus, FaEnvelope,
  FaSignOutAlt, FaSignInAlt, FaUserPlus, FaMapMarkerAlt,
  FaBars, FaUsers, FaHome, FaShoppingCart, FaCheckCircle,
  FaGlobe, FaSmile, FaSearch, FaChevronDown, FaTimes
} from "react-icons/fa";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const userRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const optionsRef = useRef(null);
  const searchInputRef = useRef(null);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  useEffect(() => {
    // Fermer les menus lors du changement de route
    setOpen(false);
    setMobileMenu(false);
  }, [pathname]);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickOutside = (e) => {
    if (userRef.current && !userRef.current.contains(e.target) &&
        optionsRef.current && !optionsRef.current.contains(e.target)) {
      setOpen(false);
    }

    if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) &&
        !e.target.closest('.hamburger')) {
      setMobileMenu(false);
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
      setOpen(false);
      setMobileMenu(false);
    }
  };

  const handleUserClick = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      // Implémenter la recherche
      navigate(`/search?q=${e.target.value}`);
    }
  };

  const adminLinks = [
    { path: "/admin", icon: <FaHome />, text: "Dashboard" },
    { path: "/admin/users", icon: <FaUsers />, text: "Users" },
    { path: "/admin/gigs", icon: <FaCalendarAlt />, text: "Services" },
    { path: "/admin/orders", icon: <FaShoppingCart />, text: "Orders" },
    { path: "/admin/verifications", icon: <FaCheckCircle />, text: "Verifications" },
    { path: "/admin/countries", icon: <FaGlobe />, text: "Countries" },
    { path: "/admin/pois", icon: <FaSmile />, text: "POIs" }
  ];

  return (
      <div className={`navbar ${active || pathname !== "/" ? "active" : ""} ${mobileMenu ? "menu-open" : ""}`}>
        <div className="container">
          <div className="logo">
            <Link to="/" className="logo-link" aria-label="BlaBlaTripLogo">
              <img src="/img/img_3.png" alt="BlaBlaTripLogo"/>
            </Link>
          </div>

          <div className="nav-center">
            <div className={`search-bar ${searchFocused ? "focused" : ""}`}>
              <FaSearch className="search-icon"/>
              <input
                  type="text"
                  placeholder="Rechercher des expériences..."
                  ref={searchInputRef}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  onKeyDown={handleSearch}
              />
            </div>

            <nav className="main-links" aria-label="Navigation principale">
              <Link to="/" className={pathname === "/" ? "active" : ""}>
                Accueil
              </Link>
              <Link to="/about" className={pathname === "/about" ? "active" : ""}>
                À propos
              </Link>
              <Link to="/services" className={pathname === "/services" ? "active" : ""}>
                Services
              </Link>
              <Link to="/contact" className={pathname === "/contact" ? "active" : ""}>
                Contact
              </Link>
            </nav>
          </div>

          <button
              className="hamburger"
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-expanded={mobileMenu}
              aria-label="Menu principal"
          >
            {mobileMenu ? <FaTimes /> : <FaBars />}
          </button>

          <div className="links">
            {currentUser ? (
                <div
                    className="user"
                    ref={userRef}
                    onClick={handleUserClick}
                    onKeyDown={(e) => handleKeyDown(e, () => setOpen(!open))}
                    tabIndex="0"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded={open}
                >
                  <img src={currentUser.img || "/img/noavatar.jpg"} alt="" />
                  <div className="user-info">

                    <span>{currentUser?.username}</span>
                    {currentUser.isAmbassador && (
                        <span className="ambassador-badge">Ambassador</span>
                    )}
                  </div>
                  <FaChevronDown className={`dropdown-icon ${open ? "rotated" : ""}`} />

                  <div className={`options ${open ? "open" : ""}`} ref={optionsRef}>
                    <div className="user-info">
                      <img src={currentUser.img || "/img/noavatar.jpg"} alt="" />
                      <div>
                        <span className="username">{currentUser?.username}</span>
                        {currentUser.isAmbassador && (
                            <span className="badge">Ambassador</span>
                        )}
                      </div>
                    </div>
                    <div className="menu-links">
                      <Link className="link" to="/profile" onClick={() => setOpen(false)}>
                        <FaUserCircle /> Profil
                      </Link>
                      {currentUser.isAmbassador && (
                          <>
                            <Link className="link" to="/mygigs" onClick={() => setOpen(false)}>
                              <FaCalendarAlt /> Mes services
                            </Link>
                            <Link className="link" to="/add" onClick={() => setOpen(false)}>
                              <FaPlus /> Ajouter
                            </Link>
                          </>
                      )}
                      <Link className="link" to="/orders" onClick={() => setOpen(false)}>
                        <FaMapMarkerAlt /> Commandes
                      </Link>
                      <Link className="link" to="/messages" onClick={() => setOpen(false)}>
                        <FaEnvelope /> Messages
                      </Link>

                      {currentUser.isAdmin && (
                          <div className="admin-section">
                            <div className="section-title">Admin Panel</div>
                            {adminLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    className="link admin-link"
                                    to={link.path}
                                    onClick={() => setOpen(false)}
                                >
                                  {link.icon} {link.text}
                                </Link>
                            ))}
                          </div>
                      )}

                      <div className="divider"></div>
                      <button className="link logout" onClick={handleLogout}>
                        <FaSignOutAlt /> Déconnexion
                      </button>
                    </div>
                  </div>
                </div>
            ) : (
                <div className="auth-links">
                  <Link to="/login" className="signin">
                    <FaSignInAlt /> Connexion
                  </Link>
                  <span className="divider">|</span>
                  <Link to="/register" className="signup">
                    <FaUserPlus /> Inscription
                  </Link>
                </div>
            )}
          </div>
        </div>

        {/* Menu Mobile */}
        <div
            className={`mobile-menu ${mobileMenu ? "open" : ""}`}
            ref={mobileMenuRef}
            aria-hidden={!mobileMenu}
        >
          <div className="mobile-search">
            <div className="search-bar">
              <FaSearch className="search-icon"/>
              <input
                  type="text"
                  placeholder="Rechercher des expériences..."
                  onKeyDown={handleSearch}
              />
            </div>
          </div>

          <div className="mobile-links">
            <Link to="/" className={pathname === "/" ? "active" : ""} onClick={() => setMobileMenu(false)}>
              <FaHome /> Accueil
            </Link>
            <Link to="/about" className={pathname === "/about" ? "active" : ""} onClick={() => setMobileMenu(false)}>
              À propos
            </Link>
            <Link to="/services" className={pathname === "/services" ? "active" : ""} onClick={() => setMobileMenu(false)}>
              Services
            </Link>
            <Link to="/contact" className={pathname === "/contact" ? "active" : ""} onClick={() => setMobileMenu(false)}>
              Contact
            </Link>

            {/* Section utilisateur mobile */}
            {currentUser && (
                <>
                  <div className="mobile-user-section">
                    <div className="mobile-user-info">
                      <img src={currentUser.img || "/img/noavatar.jpg"} alt="" />
                      <div>
                        <br/>
                        <hr/>
                        <span className="username">{currentUser?.username}</span>
                        {currentUser.isAmbassador && (
                            <span className="badge">Ambassador</span>
                        )}
                      </div>
                    </div>
                    <Link to="/profile" className="mobile-user-link" onClick={() => setMobileMenu(false)}>
                      <FaUserCircle /> Profil
                    </Link>
                    {currentUser.isAmbassador && (
                        <>
                          <Link to="/mygigs" className="mobile-user-link" onClick={() => setMobileMenu(false)}>
                            <FaCalendarAlt /> Mes Services
                          </Link>
                          <Link to="/add" className="mobile-user-link" onClick={() => setMobileMenu(false)}>
                            <FaPlus /> Ajouter
                          </Link>
                        </>
                    )}
                    <Link to="/orders" className="mobile-user-link" onClick={() => setMobileMenu(false)}>
                      <FaMapMarkerAlt /> Commandes
                    </Link>
                    <Link to="/messages" className="mobile-user-link" onClick={() => setMobileMenu(false)}>
                      <FaEnvelope /> Messages
                    </Link>

                    {currentUser.isAdmin && (
                        <div className="mobile-admin-section">
                          <div className="section-title">Admin Panel</div>
                          {adminLinks.map((link) => (
                              <Link
                                  key={link.path}
                                  className="mobile-user-link admin-link"
                                  to={link.path}
                                  onClick={() => setMobileMenu(false)}
                              >
                                {link.icon} {link.text}
                              </Link>
                          ))}
                        </div>
                    )}

                    <div className="mobile-divider"></div>
                    <button className="mobile-user-link logout" onClick={handleLogout}>
                      <FaSignOutAlt /> Déconnexion
                    </button>
                  </div>
                </>
            )}
          </div>

          {!currentUser && (
              <div className="mobile-auth">
                <Link to="/login" className="signin-btn" onClick={() => setMobileMenu(false)}>
                  <FaSignInAlt /> Connexion
                </Link>
                <Link to="/register" className="signup-btn" onClick={() => setMobileMenu(false)}>
                  <FaUserPlus /> Inscription
                </Link>
              </div>
          )}
        </div>

        {/* Overlay pour le menu mobile et les options */}
        {(mobileMenu || open) && (
            <div
                className="menu-overlay"
                onClick={() => {
                  setMobileMenu(false);
                  setOpen(false);
                }}
            />
        )}
      </div>
  );
}

export default Navbar;
