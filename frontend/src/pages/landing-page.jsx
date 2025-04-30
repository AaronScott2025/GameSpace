import { React } from "react";
import "../styles/landing-page.css";
import { GiAstronautHelmet } from "react-icons/gi";
import { FaUsers, FaMapMarkedAlt } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { BsRocket } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { RiAliensFill } from "react-icons/ri";
import { TiMessages } from "react-icons/ti";

const LandingPage = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/home");
  };

  const goToLogin = () => {
    navigate("/login");
  };

  const goToFAQ = () => {
    navigate("/faq");
  };

  const goToMarket = () => {
    navigate("/marketplace");
  };

  const goToEvent = () => {
    navigate("/events");
  };

  const goToChatbot = () => {
    navigate("/chatbot");
  };

  const goToPartyFinder = () => {
    navigate("/partyfinder");
  };

  const goToMessages = () => {
    navigate("/dm-page");
  };

  return (
    <div className="landing-page">
      {/* Big purple buttons fixed at the top-right */}
      <div className="top-buttons">
        <button className="top-button" onClick={goToLogin}>
          Login
        </button>
        <button className="top-button" onClick={goToFAQ}>
          FAQ
        </button>
      </div>

      <div className="planet-container">
        <img src="/planet.png" alt="Planet" className="planet" />
        <h1 className="title">
          G A M E <br /> S P A C E
        </h1>
        <div className="icon messages" onClick={goToMessages}>
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
        <div className="icon clan" onClick={goToEvent}>
          <FaMapMarkedAlt size={50} />
          <span className="tooltip">Events</span>
        </div>
        <div className="icon whistle" onClick={goToChatbot}>
          <RiAliensFill size={50} />
          <span className="tooltip">Chatbot</span>
        </div>
        <div className="icon frens" onClick={goToPartyFinder}>
          <FaUsers size={50} />
          <span className="tooltip">PartyFinder</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

/* Praj */
