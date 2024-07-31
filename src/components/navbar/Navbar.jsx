import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Navbar.scss";
import { FaUserCircle, FaCalendarAlt, FaPlus, FaEnvelope, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaMapMarkerAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

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
            <span className="text">Geeders</span>
          </Link>
        </div>
        <div className="links">
          {!currentUser?.isSeller && <span>Become a Guide</span>}
          {currentUser ? (
            <div className="user" onClick={() => setOpen(!open)}>
              <img src={currentUser.img || "/img/noavatar.jpg"} alt="" />
              <span>{currentUser?.username}</span>

              {open && (
                <div className="options">
                         <Link className="link" to="/profile">
                    <FaUserCircle /> Profile
                  </Link>
                  {currentUser.isSeller && (
                    <>
                      <Link className="link" to="/mygigs">
                        <FaCalendarAlt /> My Posts
                      </Link>
                      <Link className="link" to="/add">
                        <FaPlus /> Add new
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
               <button className="login"><FaSignInAlt /> Sign in</button>
              </Link>
              <Link className="link" to="/register">
                <button><FaUserPlus /> Join</button>
              </Link>
            </>
          )}
        </div>
      </div>
      {(active || pathname !== "/" && pathname !== '/profile' && pathname !== '/mygigs' && pathname !== '/add' && pathname !== '/messages' && pathname.startsWith("/message/") && pathname !== '/message' && pathname !== '/orders') && (
        <>
          <hr />
          <div className="menu">
            <Link className="link menuLink" to="/gigs?country=United+States&city=Chicago">Chicago, United States</Link>
            <Link className="link menuLink" to="/gigs?country=France&city=Paris">Paris, France</Link>
            <Link className="link menuLink" to="/gigs?country=Italy&city=Rome">Rome, Italy</Link>
            <Link className="link menuLink" to="/gigs?country=Morocco">Morocco, Casablanca</Link>
            <Link className="link menuLink" to="/gigs?country=United+Kingdom&city=London">London, United Kingdom</Link>
            <Link className="link menuLink" to="/gigs?country=Brazil&city=Rio+de+Janeiro">Rio de Janeiro, Brazil</Link>
            <Link className="link menuLink" to="/gigs?country=India&city=Mumbai">Mumbai, India</Link>
            <Link className="link menuLink" to="/gigs?country=Russia&city=Moscow">Moscow, Russia</Link>
            <Link className="link menuLink" to="/gigs?country=Australia&city=Sydney">Sydney, Australia</Link>
          <Link className="link menuLink" to="/gigs?country=Japan&city=Tokyo">Tokyo, Japan</Link>
          <Link className="link menuLink" to="/gigs?country=Germany&city=Berlin">Berlin, Germany</Link>
          <Link className="link menuLink" to="/gigs?country=Canada&city=Toronto">Toronto, Canada</Link>
          <Link className="link menuLink" to="/gigs?country=Brazil&city=Rio+de+Janeiro">Rio de Janeiro, Brazil</Link>
            <Link className="link menuLink" to="/gigs?country=India&city=Mumbai">Mumbai, India</Link>
            <Link className="link menuLink" to="/gigs?country=Russia&city=Moscow">Moscow, Russia</Link>
            <Link className="link menuLink" to="/gigs?country=Australia&city=Sydney">Sydney, Australia</Link>
          <Link className="link menuLink" to="/gigs?country=Japan&city=Tokyo">Tokyo, Japan</Link>
          <Link className="link menuLink" to="/gigs?country=Germany&city=Berlin">Berlin, Germany</Link>
          <Link className="link menuLink" to="/gigs?country=Canada&city=Toronto">Toronto, Canada</Link>
          </div>
          <hr />
        </>
      )}
    </div>
  );
}

export default Navbar;
