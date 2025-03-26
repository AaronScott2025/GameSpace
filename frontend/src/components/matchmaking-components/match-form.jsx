import React from "react";

import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../pages/UserContext";
import { LuSwords } from "react-icons/lu";
import { GiSatelliteCommunication } from "react-icons/gi";
import RadioButton from "../Radio-button";
import axios from "axios";

function PreferencesForm(onSubmit) {
  const { user } = useContext(UserContext);
  const [preferences, setPreferences] = useState({
    playStyle: "",
    playerDescription: "",
    playerPersonality: "",
    micUsage: "",
    playTime: "",
    top5Games: "",
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
  const calculateWeight = (playerTypeInt) => {
    // Example weight calculation, you can adjust this as needed
    return (
      playerTypeInt.reduce((acc, value) => acc + value, 0) /
      playerTypeInt.length
    );
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

    const { error } = await supabase
      .from("duo_matchmaker")
      .update({
        playerType: playerType,
        top_5_games: preferences.top5Games,
        description: preferences.description,
        playerTypeInts: playerTypeInt,
      })
      .eq("username", user.username);

    if (error) {
      console.error("Error updating preferences:", error);
    } else {
      onSubmit(preferences);
    }
  };

  return (
    <div className="preferences-container">
      <div className="title-description">
        <h1 className="info-title">
          <GiSatelliteCommunication />
          Party Finder
        </h1>

        <p>
          Welcome to the Party Finder! This feature helps you connect with other
          gamers who share your interests and play style. Whether you're looking
          for a competitive team, casual gaming buddies, or just someone to
          chill with, the Party Finder has got you covered.
        </p>
        <h2>How it works:</h2>
        <ol className="how-it-works">
          <li>
            <span className="highlight">Set Your Preferences:</span> Fill out
            the preferences form to let us know your play style, favorite games,
            personality, and more. This helps us match you with the best
            possible gaming partners.
          </li>
          <li>
            <span className="highlight">Browse Profiles:</span> Once your
            preferences are set, browse through profiles of other gamers. Each
            profile includes a picture, username, top games, player type, and a
            brief description.
          </li>

          <li>
            <span className="highlight">Swipe to Match:</span> Swipe left if
            you're not interested, or swipe right to connect with a gamer.
          </li>
          <li>
            <span className="highlight">Connect and Play:</span> Once matched,
            you can start chatting and plan your next gaming session together.
          </li>
        </ol>
      </div>
      <div className="preferences-form-container">
        <div className="preferences-form-wrapper">
          <form onSubmit={handleSubmit} className="preferences-form">
            <h2>Set Your Preferences</h2>
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
                  value={preferences.playStyle}
                  onChange={handleChange}
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
                  value={preferences.playerDescription}
                  onChange={handleChange}
                />
              </div>
            </label>
            <label>
              Which of the following best describes your personality?
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
              How much do you use your microphone in game?
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
                  value={preferences.playTime}
                  onChange={handleChange}
                />
              </div>
            </label>
            <label>
              What are your top 5 favorite games?
              <div>
                <input
                  type="text"
                  id="Top5Games"
                  name="top5Games"
                  value={preferences.top5games}
                  onChange={handleChange}
                  required
                ></input>
              </div>
            </label>
            <label>
              please provide a brief description of yourself:
              <div>
                <input
                  type="text"
                  id="Description"
                  name="description"
                  value={preferences.description}
                  onChange={handleChange}
                  required
                ></input>
              </div>
            </label>
            <div className="button-container">
              <button type="submit">
                <LuSwords />
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default PreferencesForm;
