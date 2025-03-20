import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../style.scss";
import MobileMenu from './MobileMenu';
import {
  FaUserCircle,
  FaCalendarAlt,
  FaPlus,
  FaMapMarkerAlt,
  FaEnvelope,
  FaSignOutAlt,
} from 'react-icons/fa';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openProfileDropdown, setOpenProfileDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    username: 'JohnDoe',
    img: '/img/noavatar.jpg',
  }); // Mock user data

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setOpenProfileDropdown(!openProfileDropdown);
  };

  const handleLogout = () => {
    setCurrentUser(null); // Clear user data on logout
    setOpenProfileDropdown(false); // Close the dropdown
  };

  return (
    <>
      <MobileMenu isOpen={isMobileMenuOpen} />

      {/* Header Area */}
      <header className="vs-header header-layout1">
        <div className="container">
          <div className="header-top">
            <div className="row justify-content-between align-items-center">
              <div className="col d-none d-lg-block">
                <ul className="header-contact">
                  <li>
                    <i className="fas fa-envelope"></i>
                    <a href="mailto:info@travolo.com">info@travolo.com</a>
                  </li>
                  <li>
                    <i className="fas fa-phone-alt"></i>
                    <a href="tel:02073885619">020 7388 5619</a>
                  </li>
                </ul>
              </div>
              <div className="col-auto">
                <div className="header-social">
                  <a href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-pinterest-p"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
              </div>
              <div className="col-auto d-flex">
                <div className="header-dropdown">
                  <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink1" data-bs-toggle="dropdown" aria-expanded="false">
                    English
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink1">
                    <li><a href="#">German</a></li>
                    <li><a href="#">French</a></li>
                    <li><a href="#">Italian</a></li>
                    <li><a href="#">Latvian</a></li>
                    <li><a href="#">Spanish</a></li>
                    <li><a href="#">Greek</a></li>
                  </ul>
                </div>
                {currentUser ? (
                  <div className="user-btn" onClick={toggleProfileDropdown}>
                    <img src={currentUser.img || "/img/noavatar.jpg"} alt="User Avatar" className="profile-img" />
                    <span>{currentUser.username}</span>
                    {openProfileDropdown && (
                      <div className="dropdown-menu">
                        <Link className="dropdown-item" to="/profile">
                          <FaUserCircle /> Profile
                        </Link>
                        {currentUser.isAmbassador && (
                          <>
                            <Link className="dropdown-item" to="/mygigs">
                              <FaCalendarAlt /> My Posts
                            </Link>
                            <Link className="dropdown-item" to="/add">
                              <FaPlus /> Add New
                            </Link>
                          </>
                        )}
                        <Link className="dropdown-item" to="/orders">
                          <FaMapMarkerAlt /> Orders
                        </Link>
                        <Link className="dropdown-item" to="/messages">
                          <FaEnvelope /> Messages
                        </Link>
                        <Link className="dropdown-item" onClick={handleLogout}>
                          <FaSignOutAlt /> Logout
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/login" className="user-btn">
                    <i className="far fa-user-circle"></i>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="sticky-wrapper">
            <div className="sticky-active">
              <div className="container position-relative z-index-common">
                <div className="row align-items-center justify-content-between">
                  <div className="col-auto">
                    <div className="vs-logo">
                      <Link to="/">
                        <img src="assets/img/logo.svg" alt="logo" />
                      </Link>
                    </div>
                  </div>
                  <div className="col text-end text-xl-center">
                    <nav className="main-menu menu-style1 d-none d-lg-block">
                      <ul>
                        <li className="menu-item-has-children">
                          <Link to="/">Home</Link>
                          <ul className="sub-menu">
                            <li><Link to="/index.html">Home One</Link></li>
                            <li><Link to="/index-2.html">Home Two</Link></li>
                            <li><Link to="/index-3.html">Home Three</Link></li>
                            <li><Link to="/index-4.html">Home Four</Link></li>
                            <li><Link to="/index-5.html">Home Five</Link></li>
                            <li><Link to="/index-6.html">Home Six</Link></li>
                          </ul>
                        </li>
                        <li className="menu-item-has-children">
                          <Link to="/destinations">Destinations</Link>
                          <ul className="sub-menu">
                            <li><Link to="/destinations.html">Destinations</Link></li>
                            <li><Link to="/destination-details.html">Destinations Details</Link></li>
                          </ul>
                        </li>
                        {/* Add other menu items */}
                      </ul>
                    </nav>
                    <button className="vs-menu-toggle d-inline-block d-lg-none" onClick={toggleMobileMenu}>
                      <i className="fal fa-bars"></i>
                    </button>
                  </div>
                  <div className="col-auto d-none d-xl-block">
                    <div className="header-btns">
                      <button className="sideMenuToggler">
                        <i className="fal fa-bars"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;