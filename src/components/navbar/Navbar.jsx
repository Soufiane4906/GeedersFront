import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Navbar.scss";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  const { pathname } = useLocation();


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

  const navigate = useNavigate();

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
    <div className={active || pathname !== "/"  ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            <span className="text">Geeders</span>
          </Link>
          {/* <span className="dot"> > </span> */}
        </div>
        <div className="links">
          {/* <span>guideers Business</span> */}
          <span>Explore</span>
          <span>English</span>
          {!currentUser?.isSeller && <span>Become a Guide</span>}
          {currentUser ? (
            <div className="user" onClick={() => setOpen(!open)}>
              <img src={currentUser.img || "/img/noavatar.jpg"} alt="" />
              <span>{currentUser?.username}</span>
              {open && (
                <div className="options">
                  {  (!currentUser.isComplete) && (
                    <>
                    <Link className="link" to="/profile">
                          Profil
                        </Link>
                      <Link className="link" to="/mygigs">
                        Guide Profile
                      </Link>
                      <Link className="link" to="/add">
                        Add new
                      </Link>
                    </>
                  )}
                  <Link className="link" to="/orders">
                    Reservations
                  </Link>
                  <Link className="link" to="/messages">
                    Messages
                  </Link>
                  <Link className="link" onClick={handleLogout}>
                    Logout
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="link">Sign in</Link>
              <Link className="link" to="/register">
                <button>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>
      {(active || pathname !== "/" && pathname !=='/profile' && pathname !=='/mygigs' ) && (
        <>
          <hr />
          <div className="menu">
  <Link className="link menuLink" to="/paris">
    Eiffel Tower, Paris
  </Link>
  <Link className="link menuLink" to="/rome">
    Colosseum, Rome
  </Link>
  <Link className="link menuLink" to="/nyc">
    Statue of Liberty, NYC
  </Link>
  <Link className="link menuLink" to="/cairo">
    Pyramids of Giza, Cairo
  </Link>
  <Link className="link menuLink" to="/sydney">
    Sydney Opera House, Sydney
  </Link>
  {/* <Link className="link menuLink" to="/beijing">
    Great Wall of China, Beijing
  </Link>
  <Link className="link menuLink" to="/tokyo">
    Mount Fuji, Tokyo
  </Link> */}
  <Link className="link menuLink" to="/london">
    Big Ben, London
  </Link>
  {/* <Link className="link menuLink" to="/dubai">
    Burj Khalifa, Dubai
  </Link> */}
  <Link className="link menuLink" to="/rio">
    Christ the Redeemer, Rio de Janeiro
  </Link>
  {/* <Link className="link menuLink" to="/barcelona">
    Sagrada Familia, Barcelona
  </Link>
  <Link className="link menuLink" to="/athens">
    Acropolis, Athens
  </Link> */}
  <Link className="link menuLink" to="/mumbai">
    Gateway of India, Mumbai
  </Link>
  <Link className="link menuLink" to="/moscow">
    Red Square, Moscow
  </Link>
  <Link className="link menuLink" to="/venice">
    Grand Canal, Venice
  </Link>
  {/* <Link className="link menuLink" to="/istanbul">
    Hagia Sophia, Istanbul
  </Link>
  <Link className="link menuLink" to="/bangkok">
    Grand Palace, Bangkok
  </Link>
  <Link className="link menuLink" to="/capetown">
    Table Mountain, Cape Town
  </Link>
  <Link className="link menuLink" to="/machupicchu">
    Machu Picchu, Peru
  </Link> */}
</div>

          <hr />
        </>
      )}
    </div>
  );
}

export default Navbar;
