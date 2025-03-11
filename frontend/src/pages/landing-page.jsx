import { React } from "react";
//import Header from "../components/header";
import "../Styles/landing-page.css";
import {GiAstronautHelmet,GiWhistle, GiSatelliteCommunication,} from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { BsRocket } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

/*<Header />*/
const LandingPage = () => {
  const navigate = useNavigate(); //  navigate function
  const goToHome = () => {
    navigate("/home"); // Navigate to Home page
  };
  const goToLogin = () => {
    navigate("/login"); // Navigate to Login page
  };
  return (
    <div className="landing-page">
      <div className="planet-container">
        <img src="/planet.png" alt="Planet" className="planet" />
        <h1 className="title">
          {" "}
          G A M E <br /> S P A C E{" "}
        </h1>
        <div className="icon rocket" onClick={goToHome}>
          <BsRocket size={50} />
          <span className="tooltip">Home</span>
        </div>
        <div className="icon helmet" onClick={goToLogin}>
          <GiAstronautHelmet size={50} />
          <span className="tooltip">LogIn</span>
        </div>
        <div className="icon store">
          <CiShoppingCart size={50} />
          <span className="tooltip">Market</span>
        </div>
        <div className="icon clan">
          <FaUsers size={50} />
          <span className="tooltip">Clans</span>
        </div>
        <div className="icon whistle">
          <GiWhistle size={50} />
          <span className="tooltip">Coaching</span>
        </div>
        <div className="icon frens">
          <GiSatelliteCommunication size={50} />
          <span className="tooltip">PartyFinder</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

/* Praj */
