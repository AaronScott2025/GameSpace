import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
//import { BiSolidJoystickButton } from "react-icons/bi";
//import { BiSolidDownArrow } from "react-icons/bi";
import { BsJoystick, BsRocket } from "react-icons/bs";
import { GiAstronautHelmet, GiSatelliteCommunication} from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { RiAliensFill } from "react-icons/ri";
import { CiShoppingCart } from "react-icons/ci";
import { TiMessages } from "react-icons/ti";
import "./nav-bar.css";
import useSound from "../hooks/useSound"; // Custom hook

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

  //Linking of Sound effects to Hook
  const mouseClickSound = useSound("/sounds/mouse-click.mp3");
  const gameStartSound = useSound("/sounds/game-start.mp3");

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <NavLink to="/home" onClick={() =>{ mouseClickSound.play(0.1);}}>GameSpace</NavLink>
        </div>

        <button className="nav-button" onClick={() =>{handleMenuToggle(); }}>
          <BsJoystick size={30} />
        </button>

        <div className="profile-auth">
          <NavLink to="/account"
          
           className="profile-btn">
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
              onClick={() =>{ mouseClickSound.play(0.1);}}
              className={({ isActive }) => `${isActive ? "active-link" : ""} nav-home`}
              >
              <BsRocket /> Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/marketplace"
              onClick={() =>{ mouseClickSound.play(0.1);}}
              className={({ isActive }) => `${isActive ? "active-link" : ""} nav-market`}
              >
              <CiShoppingCart /> Market
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/partyfinder"
              onClick={() =>{ mouseClickSound.play(0.1);}}
              className={({ isActive }) => `${isActive ? "active-link" : ""} nav-party`}
              >
              <GiSatelliteCommunication /> PartyFinder
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/chatbot"
              onClick={() =>{ mouseClickSound.play(0.1);}}
              className={({ isActive }) => `${isActive ? "active-link" : ""} nav-chatbot`}
              >
              <RiAliensFill /> Chatbot
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/events"
              onClick={() =>{ mouseClickSound.play(0.1);}}
              className={({ isActive }) => `${isActive ? "active-link" : ""} nav-events`}
              >
              <FaUsers /> Events
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dm-page"
              onClick={() =>{ mouseClickSound.play(0.1);}}
              className={({ isActive }) => `${isActive ? "active-link" : ""} nav-dm`}
              >
              <TiMessages /> Messages
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
