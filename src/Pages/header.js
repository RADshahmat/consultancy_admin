import '../Styles/header.css';

import React from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';



const Header = ({ isMenuOpen, toggleMenu }) => {
    console.log(isMenuOpen);
  return (
    <header className="header">
      <div className="logo"><img src='logo2.png' /></div>
      <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
        <a href="#">For Business</a>
        <a href="#">Book An Appointment</a>
        <a href="#">Login/Register</a>
      </nav>
     
      <div className="hamburger" onClick={toggleMenu}>
        {isMenuOpen ?<FaTimes /> : <FaBars />}
      </div>
      <div className={`mobile-menu ${isMenuOpen ? 'expanded' : ''}`}>
        <a href="#">For Business</a>
        <a href="#">Book An Appointment</a>
        <a style={{marginBottom:'1.5rem'}} href="#">Login/Register</a>
      </div>
    </header>
  );
};

export default Header;





