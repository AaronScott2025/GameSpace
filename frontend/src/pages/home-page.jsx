import Navbar from "../components/nav-bar";
import "./home-page.css";

const items = [
  { id: 1, title: "Item 1", description: "This is the first item.", image: "../public/planet.png" },
  { id: 2, title: "Item 2", description: "This is the second item.", image: "../public/planet.png" },
  { id: 3, title: "Item 3", description: "This is the third item.", image: "../public/planet.png" },
  { id: 4, title: "Item 4", description: "This is the fourth item.", image: "../public/planet.png" },
  { id: 5, title: "Item 5", description: "This is the fifth item.", image: "../public/planet.png" },
  { id: 6, title: "Item 6", description: "This is the sixth item.", image: "../public/planet.png" },
  { id: 7, title: "Item 7", description: "This is the seventh item.", image: "../public/planet.png" },
  { id: 8, title: "Item 8", description: "This is the seventh item.", image: "../public/planet.png" },
  { id: 9, title: "Item 9", description: "This is the seventh item.", image: "../public/planet.png" },
  { id: 10, title: "Item 10", description: "This is the seventh item.", image: "../public/planet.png" },
  { id: 11, title: "Item 11", description: "This is the seventh item.", image: "../public/planet.png" },
  { id: 12, title: "Item 12", description: "This is the seventh item.", image: "../public/planet.png" },
  { id: 13, title: "Item 13", description: "This is the seventh item.", image: "../public/planet.png" },
  { id: 14, title: "Item 14", description: "This is the seventh item.", image: "../public/planet.png" },
];
import React, { useContext } from "react";
import { supabase } from "../../client";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

const HomePage = () => {
  const navigate = useNavigate();
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/login");
  };

  const { user } = useContext(UserContext);
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
            <Navbar />

      <div className="profileinfo-container">
      <h1>Welcome to the Home Page!</h1>
      <h1>Logged in as: </h1>
       <div className = "profileinfo-box">
       <p>Username: {user.username}</p>
       <p>Email: {user.email}</p>
       <button onClick={signOut}>sign Out</button>
       </div>
      </div>

      <div className="media-container">
      <h1>Media Posts</h1>
      <div className="scroll-box">
        {items.map((item) => (
          <div key={item.id} className="media-box">
            <img src={item.image} alt={item.title} className="media-image" />
            <div className="media-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      </div>
      
      <div className="localevents-container">
        <h1>Local Events</h1>
      <div className="scroll-box">
      {items.map((item) => (
          <div key={item.id} className="localevent-box">
            <img src={item.image} alt={item.title} className="localevent-image" />
            <div className="localevent-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
}

export default HomePage;
