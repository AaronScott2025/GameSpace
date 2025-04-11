import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../pages/UserContext.jsx";
import "../styles/postSignupPopup.css";

const PostSignupPopup = () => {
  const { user } = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);

  // Form state (for UI only, no functionality implemented)
  const [age, setAge] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [bio, setBio] = useState("");

  // For favorite games - these would eventually trigger selection popups
  const [favoriteGames, setFavoriteGames] = useState({
    game1: "",
    game2: "",
    game3: "",
    game4: "",
    game5: "",
    game6: ""
  });

  // Optional gaming accounts
  const [steam, setSteam] = useState("");
  const [epicGames, setEpicGames] = useState("");
  const [psn, setPsn] = useState("");
  const [xbox, setXbox] = useState("");
  const [discord, setDiscord] = useState("");

  useEffect(() => {
    if (user) {
      const creationDate = new Date(user.created_at).toDateString();
      const today = new Date().toDateString();

      if (creationDate === today && !user.age) {
        setShowPopup(true);
      }
    }
  }, [user]);

  // Handle changes to favorite games (placeholder function)
  const handleGameClick = (gameNumber) => {
    console.log(`Open game selection popup for favorite game ${gameNumber}`);
    setFavoriteGames({
      ...favoriteGames,
      [`game${gameNumber}`]: `Game ${gameNumber} (selected)`
    });
  };

  const handleSaveProfile = () => {
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container profile-setup">
        <div className="popup-header">
          <h2>Complete Your Profile</h2>
          <p>Please fill out the required fields to continue</p>
        </div>

        <div className="popup-form">
          {/* Basic Info Section */}
          <div className="form-section compact">
            <h3>Basic Info</h3>
            <div className="basic-info-grid">
              <div className="form-group required">
                <label>Age</label>
                <input
                  type="number"
                  placeholder="Your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="13"
                  max="120"
                  required
                />
              </div>

              <div className="form-group required">
                <label>Pronouns</label>
                <select
                  value={pronouns}
                  onChange={(e) => setPronouns(e.target.value)}
                  required
                >
                  <option value="" disabled>Select</option>
                  <option value="he/him">He/Him</option>
                  <option value="she/her">She/Her</option>
                  <option value="they/them">They/Them</option>
                  <option value="ze/zir">Ze/Zir</option>
                  <option value="xe/xem">Xe/Xem</option>
                  <option value="prefer-not">Prefer not to say</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="form-group required">
              <label>Bio</label>
              <textarea
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
                className="compact-textarea"
              />
            </div>
          </div>

          {/* Favorite Games Section */}
          <div className="form-section compact">
            <h3>Favorite Games</h3>
            <div className="game-selection-grid">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="form-group required game-select-container">
                  <button
                    type="button"
                    className="game-select-button"
                    onClick={() => handleGameClick(num)}
                  >
                    {favoriteGames[`game${num}`] || `Game ${num}`}
                    <span className="selector-icon">+</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Gaming Accounts Section */}
          <div className="form-section compact">
            <h3>Gaming Accounts <span className="optional-label">(Optional)</span></h3>
            <div className="gaming-accounts-grid">
              <div className="form-group">
                <label>Steam</label>
                <input
                  type="text"
                  placeholder="Steam username"
                  value={steam}
                  onChange={(e) => setSteam(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Epic</label>
                <input
                  type="text"
                  placeholder="Epic Games username"
                  value={epicGames}
                  onChange={(e) => setEpicGames(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>PSN</label>
                <input
                  type="text"
                  placeholder="PSN ID"
                  value={psn}
                  onChange={(e) => setPsn(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Xbox</label>
                <input
                  type="text"
                  placeholder="Xbox Gamertag"
                  value={xbox}
                  onChange={(e) => setXbox(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Discord</label>
                <input
                  type="text"
                  placeholder="Discord username"
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="popup-actions">
          <button className="popup-button action-button" onClick={handleSaveProfile}>
            Complete Setup
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostSignupPopup;