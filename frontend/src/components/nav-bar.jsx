import React, { useState } from "react";
import { Link } from "react-router-dom";
//import { BiSolidJoystickButton } from "react-icons/bi";
//import { BiSolidDownArrow } from "react-icons/bi";
import { BsJoystick } from "react-icons/bs";
import "./nav-bar.css";


/* FOR NAVBAR U NEED TO ADD TO the PAGES/GUI'S :
import "./nav-bar.css";
<Navbar />                                    */


const Navbar = () => {
  // State to toggle the side menu visibility
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuToggle = () => {
    setMenuOpen((prevState) => !prevState);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <Link to="/home">GameSpace</Link>
        </div>

        <button className="nav-button" onClick={handleMenuToggle}>
        <BsJoystick size={30} color="#FFFF00" />
        </button>

        <div className="profile-auth">
          <Link to="/profile" className="profile-btn"> Profile </Link>
        </div>
      </nav>

      <div className={`side-menu ${menuOpen ? "open" : ""}`}>
        <ul className="nav-links">
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/market">Market</Link></li>
          <li><Link to="/clans">Clans</Link></li>
          <li><Link to="/coaching">Coaching</Link></li>
          <li><Link to="/partyfinder">Party Finder</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;