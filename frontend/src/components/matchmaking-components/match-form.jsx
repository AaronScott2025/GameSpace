import React from "react";
import { supabase } from "../../../client";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../pages/UserContext";
import "../../styles/duo-matchmaker-page.css";
import { LuSwords } from "react-icons/lu";
import RadioButton from "../Radio-button";

function MatchmakingForm() {
  const { user } = useContext(UserContext);
  const [preferences, setPreferences] = useState({
    playStyle: "",
    playerDescription: "",
    playerPersonality: "",
    micUsage: "",
    playTime: "",

    description: "",
  });
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
        console.error("Error updating preferences:", error);
        alert("Failed to update preferences. Please try again.");
      } else {
        console.log("Preferences updated successfully:", data);
        alert("Preferences updated successfully!");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };
  return (
    <div className="preferences-form-container">
      <div className="preferences-form-wrapper">
        <div className="matchmaking-form">
          <h2>Tell use your preferences</h2>
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
              How long do you spend playing games every week?(On Average)
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
            <NextSteps />
          </form>
        </div>
      </div>
    </div>
  );
}
export default MatchmakingForm;

const NextSteps = () => {
  return (
    <div className="preferences-form-container">
      <div className="preferences-form-wrapper">
        <form className="preferences-form">
          <label>Tell people what you looking for?</label>
          <textarea></textarea>
          {/** favorites games component here */}
        </form>
      </div>
    </div>
  );
};
