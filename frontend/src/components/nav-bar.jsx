import React, { useState, useEffect, useLocation } from "react";
import { NavLink } from "react-router-dom";
//import { BiSolidJoystickButton } from "react-icons/bi";
//import { BiSolidDownArrow } from "react-icons/bi";
import { BsJoystick, BsRocket } from "react-icons/bs";
import {
  GiAstronautHelmet,
  GiWhistle,
  GiSatelliteCommunication,
} from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { RiAliensFill } from "react-icons/ri";
import { CiShoppingCart } from "react-icons/ci";
import "./nav-bar.css";

/* FOR NAVBAR U NEED TO ADD THESE TO the PAGES/GUI'S WHERE U WANT THE NAVBAR :
import Navbar from "../components/nav-bar";
<Navbar />                                    */

const Navbar = () => {
  // State to toggle the side menu visibility
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const handleMenuToggle = () => {
    setMenuOpen((prevState) => !prevState);
  };
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <NavLink to="/home">GameSpace</NavLink>
        </div>

        <button className="nav-button" onClick={handleMenuToggle}>
          <BsJoystick size={30} />
        </button>

        <div className="profile-auth">
          <NavLink to="/account" className="profile-btn">
            <div className="profile-icon">
              <GiAstronautHelmet size={40} />
            </div>
          </NavLink>
        </div>
      </nav>

      <div className={`side-menu ${menuOpen ? "open" : ""}`}>
        <ul className="nav-links">
          <li>
            <NavLink
              to="/home"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <BsRocket /> Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/market"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <CiShoppingCart /> Market
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/partyfinder"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <GiSatelliteCommunication /> PartyFinder
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/chatbot"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <RiAliensFill /> Chatbot
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/clans"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaUsers /> Clans
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/coaching"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <GiWhistle /> Coaching
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
