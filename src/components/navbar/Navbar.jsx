import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Navbar.scss";
import {
  FaUserCircle,
  FaCalendarAlt,
  FaPlus,
  FaEnvelope,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaMapMarkerAlt,
  FaBars,
  FaUsers,
  FaHome,
  FaShoppingCart,
  FaCheckCircle,
  FaGlobe,
  FaSmile,
  FaSearch,
  FaChevronDown
} from "react-icons/fa";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const userRef = useRef(null);
  const mobileMenuRef = useRef(null);

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

  const BlaBlaTripLogo = () => {
    return (
        <Link to="/" className="logo-link">
          <img src={"/img/img_3.png"} alt="BlaBlaTripLogo"/>
        </Link>
    );
  };

  const handleClickOutside = (e) => {
    if (userRef.current && !userRef.current.contains(e.target)) {
      setOpen(false);
    }
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
      setMobileMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            <BlaBlaTripLogo/>
          </div>

          <div className="nav-center">
            <div className="search-bar">
              <FaSearch className="search-icon"/>
              <input type="text" placeholder="Search experiences..."/>
            </div>

            <div className="main-links">
              <Link to="/" className={pathname === "/" ? "active" : ""}>
                Home
              </Link>
              <Link to="/about" className={pathname === "/about" ? "active" : ""}>
                About
              </Link>
              <Link to="/services" className={pathname === "/services" ? "active" : ""}>
                Services
              </Link>
              <Link to="/contact" className={pathname === "/contact" ? "active" : ""}>
                Contact
              </Link>
            </div>
          </div>

          <div className="hamburger" onClick={() => setMobileMenu(!mobileMenu)}>
            <FaBars/>
          </div>

          <div className="links">
            {currentUser ? (
                <div className="user" ref={userRef} onClick={() => setOpen(!open)}>
                  <img src={currentUser.img || "/img/noavatar.jpg"} alt=""/>
                  <div className="user-info">
                    <span>{currentUser?.username}</span>
                    {currentUser.isAmbassador && (
                        <span className="ambassador-badge">Ambassador</span>
                    )}
                  </div>
                  <FaChevronDown className="dropdown-icon"/>

                  <div className={`options ${open ? "open" : ""}`}>
                    <div className="user-info">
                      <img src={currentUser.img || "/img/noavatar.jpg"} alt=""/>
                      <div>
                        <span className="username">{currentUser?.username}</span>
                        {currentUser.isAmbassador && (
                            <span className="badge">Ambassador</span>
                        )}
                      </div>
                    </div>
                    <div className="menu-links">
                      <Link className="link" to="/profile">
                        <FaUserCircle/> Profile
                      </Link>
                      {currentUser.isAmbassador && (
                          <>
                            <Link className="link" to="/mygigs">
                              <FaCalendarAlt/> My Experiences
                            </Link>
                            <Link className="link" to="/add">
                              <FaPlus/> Add New
                            </Link>
                          </>
                      )}
                      <Link className="link" to="/orders">
                        <FaMapMarkerAlt/> Orders
                      </Link>
                      <Link className="link" to="/messages">
                        <FaEnvelope/> Messages
                      </Link>

                      {currentUser.isAdmin && (
                          <div className="admin-section">
                            <div className="section-title">Admin Panel</div>
                            {adminLinks.map((link) => (
                                <Link key={link.path} className="link admin-link" to={link.path}>
                                  {link.icon} {link.text}
                                </Link>
                            ))}
                          </div>
                      )}

                      <div className="divider"></div>
                      <Link className="link logout" onClick={handleLogout}>
                        <FaSignOutAlt/> Logout
                      </Link>
                    </div>
                  </div>
                </div>
            ) : (
                <div className="auth-links">
                  <Link to="/login" className="signin">
                    <FaSignInAlt/> Sign In
                  </Link>
                  <span className="divider">|</span>
                  <Link to="/register" className="signup">
                    <FaUserPlus/> Sign Up
                  </Link>
                </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenu ? "open" : ""}`} ref={mobileMenuRef}>
          <div className="mobile-links">
            <Link to="/" className={pathname === "/" ? "active" : ""} onClick={() => setMobileMenu(false)}>
              Home
            </Link>
            <Link to="/about" className={pathname === "/about" ? "active" : ""} onClick={() => setMobileMenu(false)}>
              About
            </Link>
            <Link to="/services" className={pathname === "/services" ? "active" : ""} onClick={() => setMobileMenu(false)}>
              Services
            </Link>
            <Link to="/contact" className={pathname === "/contact" ? "active" : ""} onClick={() => setMobileMenu(false)}>
              Contact
            </Link>
          </div>

          {!currentUser && (
              <div className="mobile-auth">
                <Link to="/login" className="signin-btn" onClick={() => setMobileMenu(false)}>
                  <FaSignInAlt/> Sign In
                </Link>
                <Link to="/register" className="signup-btn" onClick={() => setMobileMenu(false)}>
                  <FaUserPlus/> Sign Up
                </Link>
              </div>
          )}
        </div>
      </div>
  );
}

export default Navbar;