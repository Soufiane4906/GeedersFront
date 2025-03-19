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
} from "react-icons/fa";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const userRef = useRef(null);

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
        <Link to="/"> <img src={"/img/img_3.png"} alt={'rfe'}/>
        </Link>

    );
  };

  const handleClickOutside = (e) => {
    if (userRef.current && !userRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
        <div className="logo">
            <BlaBlaTripLogo />

        </div>
        <div className="links">
          {currentUser ? (
            <div className="user" ref={userRef} onClick={() => setOpen(!open)}>
              <img src={currentUser.img || "/img/noavatar.jpg"} alt="" />
              <span>{currentUser?.username} </span>
              {currentUser.isSeller && (
                  <>
                 <span> (Ambassador)</span>
                  </>
              )}

              <div className={`options ${open ? "open" : ""}`}>
                <div className="user-info">
                  <img src={currentUser.img || "/img/noavatar.jpg"} alt="" />
                  <span>{currentUser?.username}</span>
                </div>
                <div className="menu-links">
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
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="link">
                <button className="login">Get Started</button>
              </Link>
            </>
          )}
        </div>
      </div>
  );
}

export default Navbar;