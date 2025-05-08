import React, { use } from "react";
import { supabase } from "../../../client";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../pages/UserContext";
import "../../styles/duo-matchmaker-page.css";
import { LuSwords } from "react-icons/lu";
import {
  getFavoriteGames,
  handleGameSelection,
} from "../../scripts/account-page-scripts";
import RadioButton from "../Radio-button";
import FavoriteGamesSection from "../FavoriteGameSection";
import { useNavigate } from "react-router-dom";

function MatchmakingForm() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    playStyle: "",
    playerDescription: "",
    playerPersonality: "",
    micUsage: "",
    playTime: "",

    description: "",
  });

  const [showNextSteps, setShowNextSteps] = useState(false); // State to toggle NextSteps
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const mapAnswersToValues = (preferences) => {
    const playStyleMap = {
      "Supportive/Backline": 3,
      "Neutral/Middle": 6,
      "Aggressive/Frontline": 9,
    };

    const playerDescriptionMap = {
      "Exclusive(1 or 2 games at a time)": 2,
      "Non-Exclusive (3 or 5 games at a time)": 4,
      "Casual (6 or 8 games at a time)": 6,
      "Variety Gamer(9+ games at a time)": 8,
    };

    const playerPersonalityMap = {
      Casual: 4,
      Competitive: 8,
      Both: 12,
      Neither: 16,
    };

    const micUsageMap = {
      Never: 3,
      Sometimes: 6,
      Often: 9,
      "Very Often": 12,
    };

    const playTimeMap = {
      "1-3 Hours": 1,
      "4-7 Hours": 2,
      "8-11 hours": 3,
      "12-15 hours": 4,
      "16+ hours": 5,
    };

    return [
      playStyleMap[preferences.playStyle],
      playerDescriptionMap[preferences.playerDescription],
      playerPersonalityMap[preferences.playerPersonality],
      micUsageMap[preferences.micUsage],
      playTimeMap[preferences.playTime],
    ];
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Preferences before submission:", preferences); // Debugging

    const playerType = [
      preferences.playStyle,
      preferences.playerDescription,
      preferences.playerPersonality,
      preferences.micUsage,
      preferences.playTime,
    ].join(", ");

    const playerTypeInt = mapAnswersToValues(preferences);

    try {
      const { data, error } = await supabase
        .from("duo_matchmaker")
        .update({
          playerType: playerType,
          description: preferences.description,
          playerTypeInts: playerTypeInt,
        })
        .eq("username", user.username);

      if (error) {
        alert("Failed to update preferences. Please try again.");
      } else {
        setShowNextSteps(true);
      }
    } catch (err) {
      alert("An unexpected error occurred. Please try again.");
    }
  };
  return (
    <div className="preferences-form-container">
      <div className="preferences-form-wrapper">
        {showNextSteps ? (
          <NextSteps setShowNextSteps={setShowNextSteps} /> // Render NextSteps if showNextSteps is true
        ) : (
          <div className="matchmaking-form">
            <h2>Tell us your preferences</h2>
            <form className="preferences-form" onSubmit={handleSubmit}>
              <label>
                In the games that it would apply to, how would you describe your
                playstyle?
                <div>
                  <RadioButton
                    name="playStyle"
                    options={[
                      "Supportive/Backline",
                      "Neutral/Middle",
                      "Aggressive/Frontline",
                    ]}
                    value={preferences.playStyle}
                    onChange={handleChange}
                  />
                </div>
              </label>
              <label>
                How many different games do you find yourself playing during the
                average week?
                <div>
                  <RadioButton
                    name="playerDescription"
                    options={[
                      "Exclusive(1 or 2 games at a time)",
                      "Non-Exclusive (3 or 5 games at a time)",
                      "Casual (6 or 8 games at a time)",
                      "Variety Gamer(9+ games at a time)",
                    ]}
                    value={preferences.playerDescription}
                    onChange={handleChange}
                  />
                </div>
              </label>
              <label>
                Which of the following best describes your playstyle?
                <div>
                  <RadioButton
                    name="playerPersonality"
                    options={["Competitive", "Casual", "Both", "Neither"]}
                    value={preferences.playerPersonality}
                    onChange={handleChange}
                  />
                </div>
              </label>
              <label>
                How often would you say you use your microphone in game?
                <div>
                  <RadioButton
                    name="micUsage"
                    options={["Never", "Sometimes", "Often", "Very Often"]}
                    value={preferences.micUsage}
                    onChange={handleChange}
                  />
                </div>
              </label>
              <label>
                How long do you spend playing games every week? (On Average)
                <div>
                  <RadioButton
                    name="playTime"
                    options={[
                      "1-3 Hours",
                      "4-7 Hours",
                      "8-11 hours",
                      "12-15 hours",
                      "16+ hour",
                    ]}
                    value={preferences.playTime}
                    onChange={handleChange}
                  />
                </div>
              </label>
              <div className="button-container">
                <button type="submit">
                  <LuSwords />
                  Next Steps
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
const NextSteps = ({ setShowNextSteps }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [favoriteGames, setFavoriteGames] = useState({});
  const [showGamePopup, setShowGamePopup] = useState(false);
  const [currentGameSlot, setCurrentGameSlot] = useState(null);
  const [description, setDescription] = useState(""); // State for description

  const handleGameClick = (slotNumber) => {
    setCurrentGameSlot(slotNumber);
    setShowGamePopup(true);
  };

  const handleSelectGame = async (game, slotNumber) => {
    if (!game || !user.id || !user.username) return;

    try {
      const result = await handleGameSelection(
        user.id,
        user.username,
        game.id,
        slotNumber
      );
      if (result.success) {
        setFavoriteGames((prev) => {
          const newGames = { ...prev };
          newGames[slotNumber] = game;
          return newGames;
        });
      } else {
        console.error("Failed to update favorite game.");
        alert("Failed to update favorite game. Please try again.");
      }
    } catch (err) {
      console.error("Error selecting game:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setShowGamePopup(false);
    }
  };
  const handleRemoveGame = (slotNumber) => {
    setFavoriteGames((prev) => {
      const newGames = { ...prev };
      newGames[slotNumber] = null;
      return newGames;
    });
  };
  useEffect(() => {
    const fetchFavoriteGames = async () => {
      try {
        const games = await getFavoriteGames(user.id, user.username);
        if (games) {
          setFavoriteGames(games);
        } else {
          console.error("No favorite games found.");
        }
      } catch (err) {
        console.error("Error fetching favorite games:", err);
      }
    };

    if (user?.id && user?.username) {
      fetchFavoriteGames();
    }
  }, [user?.id, user?.username]);

  if (!favoriteGames) {
    return <div>Loading...</div>;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate description
    if (!description.trim()) {
      alert("Please provide a description before submitting.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("duo_matchmaker")
        .update({ description, is_first_time: false }) // Update the description column
        .eq("username", user.username); // Match the row by username

      if (error) {
        console.error("Error updating description:", error);
        alert("Failed to update description. Please try again.");
      } else {
        navigate("/matches"); // Redirect to /matches
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="preferences-form">
      <form onSubmit={handleSubmit}>
        <label className="preferences-description-label">
          Describe what you are looking for?
        </label>
        <textarea
          className="description-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </form>
      <label className="preferences-description-label">
        Here are your favorite games based on our records:
      </label>
      <FavoriteGamesSection
        favoriteGames={favoriteGames}
        handleGameClick={handleGameClick}
        handleRemoveGame={handleRemoveGame}
        showGamePopup={showGamePopup}
        setShowGamePopup={setShowGamePopup}
        handleSelectGame={handleSelectGame}
        currentGameSlot={currentGameSlot}
      />
      <div className="buttons-container">
        <button
          type="button"
          className="cancel-button"
          onClick={() => setShowNextSteps(false)}
        >
          Back
        </button>
        <button type="submit" onClick={handleSubmit}>
          <LuSwords />
          Submit
        </button>
      </div>
    </div>
  );
};

export default MatchmakingForm;
