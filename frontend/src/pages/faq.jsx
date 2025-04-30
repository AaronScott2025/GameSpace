import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing-page.css";


const FAQ = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <h1 style={{ fontSize: "80px" }}>Frequently Asked Questions</h1>
        <div>
          <h2 style={{ fontSize: "50px" }}>What is Game Space?</h2>
          <p style={{ fontSize: "20px" }}>
            GameSpace is an immersive, full-service platform designed for gamers, connecting you to events, chatbots, marketplaces, and other gamers across the globe!
          </p>
        </div>
        <div>
          <h2 style={{ fontSize: "50px" }}>How does it work?</h2>
          <p style={{ fontSize: "20px" }}>
            Navigating to the "Login" Button on the landing page will prompt you to either Login, or Create a new account. If you are a new user, create an account, and sign in. Upon entering the site, you will be greeted with a 1 time startup allowing you to customize your profile picture, biography, list your favorite games, and connect any other gaming accounts you may have.
          </p>
        </div>
        <div>
          <h2 style={{ fontSize: "50px" }}>Is this a paid service?</h2>
          <p style={{ fontSize: "20px" }}>
            GameSpace is a free application. You can optionally buy services and products through the Marketplace Feature, but this is not required to use the application
          </p>
        </div>
        <div>
          <h2 style={{ fontSize: "50px" }}>Who is able to use this application?</h2>
          <p style={{ fontSize: "20px" }}>
            GameSpace was designed as an all inclusive 'Gaming hub', however everyone with any interest in GameSpace or its services can sign up and use the app effectively!
            </p>
        </div>
        <button className="top-button" onClick={() => navigate("/")}>
          Back
        </button>
      </div>
    </div>
  );
};

export default FAQ;