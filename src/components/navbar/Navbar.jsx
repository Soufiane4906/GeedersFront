import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Navbar.scss";
import { FaUserCircle, FaCalendarAlt, FaPlus, FaEnvelope, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaMapMarkerAlt } from 'react-icons/fa';
import { cities } from '../../utils/options.js';

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

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

  return (
      <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
        <div className="container">
          <div className="logo">
            <Link className="link" to="/">
              <img src="./img/img_1.svg" alt="BlaBlaTrip Logo" className="navbar-logo" />
            </Link>
          </div>
          <div className="links">
            {currentUser ? (
                <div className="user" onClick={() => setOpen(!open)}>
                  <img
                      src={currentUser.img || "/img/noavatar.jpg"}
                      alt="User Avatar"
                      className="user-avatar"
                  />
                  <span>{currentUser?.username}</span>

                  {open && (
                      <div className={`options ${open ? "open" : ""}`}>
                        <Link className="link" to="/profile">
                          <FaUserCircle /> Profile
                        </Link>
                        {currentUser.isSeller && (
                            <>
                              <Link className="link" to="/mygigs">
                                <FaCalendarAlt /> My Posts
                              </Link>
                              <Link className="link" to="/add">
                                <FaPlus /> Add New
                              </Link>
                            </>
                        )}
                        <Link className="link" to="/orders">
                          <FaMapMarkerAlt /> Orders
                        </Link>
                        <Link className="link" to="/messages">
                          <FaEnvelope /> Messages
                        </Link>
                        <Link className="link" onClick={handleLogout}>
                          <FaSignOutAlt /> Logout
                        </Link>
                      </div>
                  )}
                </div>
            ) : (
                <>
                  <Link to="/login" className="link">
                    <button className="nav-button">
                      <FaSignInAlt /> Sign in
                    </button>
                  </Link>
                  <Link className="link" to="/register">
                    <button className="nav-button">
                      <FaUserPlus /> Join
                    </button>
                  </Link>
                </>
            )}
          </div>
        </div>
        {(active && pathname === "/" || (pathname === '/profile' && pathname.startsWith('/gigs') && pathname.startsWith('/gig') && pathname !== '/messages' && pathname.startsWith("/message/") && pathname !== '/message' && pathname !== '/orders')) && (
            <div className="menu-container">
              <div className="menu">
                <div className="slider">
                  {cities.map((city, index) => (
                      <Link
                          key={index}
                          className="link menuLink"
                          to={city.link}
                      >
                        {city.name}
                      </Link>
                  ))}
                </div>
              </div>
            </div>
        )}
      </div>
  );
}

export default Navbar;