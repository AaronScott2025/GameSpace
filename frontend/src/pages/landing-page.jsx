import { React } from "react";
//import Header from "../components/header";
import "../styles/landing-page.css";
import {GiAstronautHelmet, GiSatelliteCommunication,} from "react-icons/gi";
import { FaUsers,FaMapMarkedAlt, } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { BsRocket } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { RiAliensFill } from "react-icons/ri";
import { TiMessages } from "react-icons/ti";

/*<Header />*/
const LandingPage = () => {
  const navigate = useNavigate(); //  navigate function
  const goToHome = () => {
    navigate("/home"); // Navigate to Home page
  };
  const goToLogin = () => {
    navigate("/login"); // Navigate to Login page
  };
  const goToMarket = () => {
    navigate("/marketplace")
  }
  return (
    <div className="landing-page">
      <div className="planet-container">
        <img src="/planet.png" alt="Planet" className="planet" />
        <h1 className="title">
          {" "}
          G A M E <br /> S P A C E{" "}
        </h1>
        <div className="icon messages">
          <TiMessages size={50} />
          <span className="tooltip">Messages</span>
        </div>
        <div className="icon rocket" onClick={goToHome}>
          <BsRocket size={50} />
          <span className="tooltip">Home</span>
        </div>
        <div className="icon helmet" onClick={goToLogin}>
          <GiAstronautHelmet size={50} />
          <span className="tooltip">LogIn</span>
        </div>
        <div className="icon store" onClick={goToMarket}>
          <CiShoppingCart size={50} />
          <span className="tooltip">Market</span>
        </div>
        <div className="icon clan">
          <FaMapMarkedAlt size={50} />
          <span className="tooltip">Events</span>
        </div>
        <div className="icon whistle">
          <RiAliensFill  size={50} />
          <span className="tooltip">Chatbot</span>
        </div>
        <div className="icon frens">
          <FaUsers size={50} />
          <span className="tooltip">PartyFinder</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

/* Praj */
