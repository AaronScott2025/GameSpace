import { useState, useEffect, useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../client.js";
//import { BiSolidJoystickButton } from "react-icons/bi";
//import { BiSolidDownArrow } from "react-icons/bi";
//import { GiAstronautHelmet, GiSatelliteCommunication } from "react-icons/gi";
import { BsJoystick, BsRocket } from "react-icons/bs";
import { FaUsers,FaMapMarkedAlt, } from "react-icons/fa";
import { RiAliensFill } from "react-icons/ri";
import { CiShoppingCart } from "react-icons/ci";
import { TiMessages } from "react-icons/ti";
import useSound from "../hooks/useSound"; // Custom hook
import { Tooltip } from "react-tooltip";
import { UserContext } from "../pages/UserContext"; // Import UserContext
import "./nav-bar.css";

/* FOR NAVBAR U NEED TO ADD THESE TO the PAGES/GUI'S WHERE U WANT THE NAVBAR :
import Navbar from "../components/nav-bar";
<Navbar />                                    */

const Navbar = () => {
  // State to toggle the side menu visibility
  const [menuOpen, setMenuOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(""); // Local state for profile picture
  const { user } = useContext(UserContext); // Access user context

  const navigate = useNavigate();

  const location = useLocation();
  const handleMenuToggle = () => {
    setMenuOpen((prevState) => !prevState);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/login");
  };

  //Linking of Sound effects to Hook
  const mouseClickSound = useSound("/sounds/mouse-click.mp3");
  const gameStartSound = useSound("/sounds/game-start.mp3");

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  {
    /* this didnt work */
  }
  // useEffect to update the profile picture when the user object changes
  useEffect(() => {
    if (user?.profile_pic) {
      setProfilePic(user.profile_pic); // Update local state with the new profile picture
    }
  }, [user]); // Dependency array ensures this runs when `user`

  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <NavLink
            to="/home"
            onClick={() => {
              mouseClickSound.play(0.1);
            }}
          >
            GameSpace
          </NavLink>
        </div>

        <button
          className="nav-button"
          onClick={() => {
            handleMenuToggle();
          }}
        >
          <BsJoystick size={30} />
        </button>

        <div className="profile-auth">
          <div>
            <img
              className="profile-pic-nav"
              data-tooltip-id="profile-tooltip"
              onClick={() => setIsTooltipOpen((prev) => !prev)} // Toggle tooltip visibility
              src={profilePic}
            ></img>
            <Tooltip
              id="profile-tooltip"
              place="bottom-start"
              clickable={true}
              style={{
                backgroundColor: "#3e3e3e",
                borderRadius: "10px",
              }}
              isOpen={isTooltipOpen}
              render={({ content, activeAnchor }) => (
                <div className="tooltip-content">
                  <NavLink
                    style={{ textDecoration: "none" }}
                    to="/account"
                    onClick={() => {
                      mouseClickSound.play(0.1);
                      setIsTooltipOpen(false); // Close tooltip on click
                    }}
                  >
                    <h1>Go to profile page</h1>
                  </NavLink>
                  <button className="sign-out-button" onClick={signOut}>
                    sign out
                  </button>
                </div>
              )}
            />
          </div>
        </div>
      </nav>

      <div className={`side-menu ${menuOpen ? "open" : ""}`}>
        <ul className="nav-links">
          <li>
            <NavLink
              to="/home"
              onClick={() => {
                mouseClickSound.play(0.1);
              }}
              className={({ isActive }) =>
                `${isActive ? "active-link" : ""} nav-home`
              }
            >
              <BsRocket /> Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/marketplace"
              onClick={() => {
                mouseClickSound.play(0.1);
              }}
              className={({ isActive }) =>
                `${isActive ? "active-link" : ""} nav-market`
              }
            >
              <CiShoppingCart /> Market
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/partyfinder"
              onClick={() => {
                mouseClickSound.play(0.1);
              }}
              className={({ isActive }) =>
                `${isActive ? "active-link" : ""} nav-party`
              }
            >
              <FaUsers /> PartyFinder
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/chatbot"
              onClick={() => {
                mouseClickSound.play(0.1);
              }}
              className={({ isActive }) =>
                `${isActive ? "active-link" : ""} nav-chatbot`
              }
            >
              <RiAliensFill /> Chatbot
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/events"
              onClick={() => {
                mouseClickSound.play(0.1);
              }}
              className={({ isActive }) =>
                `${isActive ? "active-link" : ""} nav-events`
              }
            >
              <FaMapMarkedAlt /> Events
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dm-page"
              onClick={() => {
                mouseClickSound.play(0.1);
              }}
              className={({ isActive }) =>
                `${isActive ? "active-link" : ""} nav-dm`
              }
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
