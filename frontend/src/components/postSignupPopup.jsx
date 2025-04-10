import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../pages/UserContext.jsx";
import "../styles/postSignupPopup.css";

const PostSignupPopup = () => {
  const { user } = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (user) {
      const creationDate = new Date(user.created_at).toDateString();
      const today = new Date().toDateString();

      if (creationDate === today && !user.age) {
        setShowPopup(true);
      }
    }
  }, [user]);

  const handleClose = () => {
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-content">
          <h2>Hey, Let's Get Started</h2>
          <p>
            It looks like you haven't set your age yet—let's update your profile
            to get the best experience on GameSpace!
          </p>
          <button className="popup-button" onClick={handleClose}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostSignupPopup;