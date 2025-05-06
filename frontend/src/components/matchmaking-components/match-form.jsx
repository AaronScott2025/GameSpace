import React from "react";
import { useState, useEffect } from "react";
import "../../styles/duo-matchmaker-page.css";
import RadioButton from "../Radio-button";

function MatchmakingForm({ onSubmit }) {
  const [preferences, setPreferences] = useState({
    playStyle: "",
    playerDescription: "",
    playerPersonality: "",
    micUsage: "",
    playTime: "",
    top5Games: "",
    description: "",
  });
  return (
    <div className="preferences-form-container">
      <div className="preferences-form-wrapper">
        <div className="matchmaking-form">
          <h2>Tell use your preferences</h2>
          <form className="preferences-form" onSubmit={onSubmit}>
            <label>
              Which of the following best describes your play style?
              <div>
                <RadioButton
                  name="playStyle"
                  options={[
                    "Supportive/Backline",
                    "Neutral/Middle",
                    "Aggressive/Frontline",
                  ]}
                />
              </div>
            </label>
            <label>
              Which of the following best describes you as a gamer?
              <div>
                <RadioButton
                  name="playerDescription"
                  options={[
                    "Exclusive(1 or 2 games at a time)",
                    "Non-Exclusive (3 or 5 games at a time)",
                    "Casual (6 or 8 games at a time)",
                    "Variety Gamer(9+ games at a time)",
                  ]}
                />
              </div>
            </label>
            <label>
              Which of the following best describes your personality?
              <div>
                <RadioButton
                  name="playerPersonality"
                  options={["Competitive", "Casual", "Both", "Neither"]}
                />
              </div>
            </label>
            <label>
              How much do you use your microphone in game?
              <div>
                <RadioButton
                  name="micUsage"
                  options={["Never", "Sometimes", "Often", "Very Often"]}
                />
              </div>
            </label>
            <label>
              How long do you spend playing games every week?
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
                />
              </div>
            </label>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default MatchmakingForm;
