import React, { useState } from 'react';
import { Link } from "react-router-dom";

const MobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState([]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) {
      setOpenSubmenus([]); // Close all submenus when the menu is closed
    }
  };

  const toggleSubmenu = (index) => {
    setOpenSubmenus((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className={`vs-menu-wrapper ${isMenuOpen ? 'vs-body-visible' : ''}`}>
      <div className="vs-menu-area text-center">
        <button className="vs-menu-toggle" onClick={toggleMenu}>
          <i className={`fal ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        <div className="mobile-logo">
          <a href="index.html">
            <img src="assets/img/logo.svg" alt="Travolo" />
          </a>
        </div>
        <div className="vs-mobile-menu">
          <ul>
            {['Home', 'Destinations', 'Pages', 'Tours', 'Shop', 'Blog'].map((menu, index) => (
              <li className={`menu-item-has-children ${openSubmenus.includes(index) ? 'vs-active' : ''}`} key={index}>
                <Link to="#" onClick={(e) => { e.preventDefault(); toggleSubmenu(index); }}>
                  {menu} <span className="vs-mean-expand"></span>
                </Link>
                <ul className={`sub-menu ${openSubmenus.includes(index) ? 'vs-open' : ''}`}>
                  {['Item 1', 'Item 2', 'Item 3'].map((subitem, subindex) => (
                    <li key={subindex}><Link to="#">{subitem}</Link></li>
                  ))}
                </ul>
              </li>
            ))}
            <li>
              <Link to="contact">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
