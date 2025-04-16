import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../pages/UserContext.jsx";
import "../styles/postSignupPopup.css";
import FavoriteGamesPopUp from "./favoriteGamesPopUp.jsx";
import { handleGameSelection } from "../scripts/account-page-scripts";
import { supabase } from "../../client.js";

const PostSignupPopup = () => {
  const { user } = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);

  const [favoriteGames, setFavoriteGames] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
  });

  const [showGamePopup, setShowGamePopup] = useState(false);
  const [currentGameSlot, setCurrentGameSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [age, setAge] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [bio, setBio] = useState("");

  // Gaming accounts state
  const [steam, setSteam] = useState("");
  const [epicGames, setEpicGames] = useState("");
  const [psn, setPsn] = useState("");
  const [xbox, setXbox] = useState("");
  const [discord, setDiscord] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      const checkFirstTimeStatus = async () => {
        try {
          if (user.is_first_time !== undefined) {
            setShowPopup(user.is_first_time);
          } else {
            const { data, error } = await supabase
              .from("profiles")
              .select("is_first_time")
              .eq("id", user.id)
              .single();

            if (error) throw error;

            if (data && data.is_first_time) {
              setShowPopup(true);
            }
          }
        } catch (err) {
          console.error("Error checking first time status:", err);
          const creationDate = new Date(user.created_at).toDateString();
          const today = new Date().toDateString();
          if (creationDate === today && !user.age) {
            setShowPopup(true);
          }
        }
      };

      checkFirstTimeStatus();
    }
  }, [user]);

  const handleGameClick = (gameNumber) => {
    setCurrentGameSlot(gameNumber);
    setShowGamePopup(true);
  };

  const handleSelectGame = (game, gameSlot) => {
    if (!game) return;
    setFavoriteGames((prevGames) => ({ ...prevGames, [gameSlot]: game }));
    setShowGamePopup(false);
  };

  const handleSaveProfile = async () => {
    if (!age || /* !pronouns || */ !bio) {
      setError("Please fill out all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const updateData = {
        age: age,
        bio: bio,
        steam_link: steam,
        Epic_link: epicGames,
        PSN_link: psn,
        Xbox_link: xbox,
        Discord_link: discord,
        is_first_time: false
      };

      const { error: userError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

      if (userError) {
        throw userError;
      }

      const gamePromises = [];
      for (let i = 1; i <= 6; i++) {
        const gameData = favoriteGames[i];
        if (gameData) {
          gamePromises.push(
            handleGameSelection(
              user.id,
              user.username || user.email,
              gameData.id,
              i
            )
          );
        }
      }

      const results = await Promise.all(gamePromises);
      const anyFailed = results.some((result) => !result.success);
      if (anyFailed) {
        throw new Error("Failed to save some game selections");
      }

      console.log("Profile setup complete!");
      setShowPopup(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!showPopup) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container profile-setup">
        <div className="popup-header">
          <h2>Complete Your Profile</h2>
          <p>Please fill out the required fields to continue</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="popup-form">
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
              {/*
              <div className="form-group required">
                <label>Pronouns</label>
                <select
                  value={pronouns}
                  onChange={(e) => setPronouns(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="he/him">He/Him</option>
                  <option value="she/her">She/Her</option>
                  <option value="they/them">They/Them</option>
                  <option value="ze/zir">Ze/Zir</option>
                  <option value="xe/xem">Xe/Xem</option>
                  <option value="prefer-not">Prefer not to say</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              */}
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
                    className={`game-select-button ${
                      favoriteGames[num] ? "has-game" : ""
                    }`}
                    onClick={() => handleGameClick(num)}
                  >
                    {favoriteGames[num] ? (
                      <>
                        <span className="game-title">
                          {favoriteGames[num].title}
                        </span>
                        <span className="change-game">Change</span>
                      </>
                    ) : (
                      <>
                        Select Game {num}
                        <span className="selector-icon">+</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section compact">
            <h3>
              Gaming Accounts <span className="optional-label">(Optional)</span>
            </h3>
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
          <button
            className="popup-button action-button"
            onClick={handleSaveProfile}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Complete Setup"}
          </button>
        </div>
      </div>

      {/* Game Selection Popup */}
      <FavoriteGamesPopUp
        isOpen={showGamePopup}
        onClose={() => setShowGamePopup(false)}
        onSelectGame={handleSelectGame}
        gameSlot={currentGameSlot}
      />
    </div>
  );
};

export default PostSignupPopup;