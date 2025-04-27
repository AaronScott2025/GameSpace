import React, { use, useState, useEffect, useContext } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";
import { GiSatelliteCommunication } from "react-icons/gi";
import RadioButton from "../components/Radio-button";
import { supabase } from "../../client";
import { UserContext } from "./UserContext";
import { LuSwords } from "react-icons/lu";
import "../styles/duo-matchmaker-page.css";
import axios from "axios";

const PreferencesForm = ({ onSubmit }) => {
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
                  className="top-5-games-input"
                  value={preferences.top5games}
                  onChange={handleChange}
                  required
                ></input>
              </div>
            </label>
            <label>
              please provide a brief description of yourself:
              <div>
                <textarea
                  type="textarea"
                  id="Description"
                  name="description"
                  className="description-input-ta"
                  value={preferences.description}
                  onChange={handleChange}
                  required
                ></textarea>
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
};

const MatchProfileCard = ({
  imgSrc,
  username,
  topGames,
  playerType,
  description,
  isActive,
  onSwipe,
  triggerSwipe,
}) => {
  // to move the card as the user drags it
  const motionValue = useMotionValue(0);

  // to rotate the card as the card moves on drag
  const rotateValue = useTransform(motionValue, [-150, 150], [-18, 18]);

  // To decrease opacity of the card when swiped
  // on dragging card to left(-200) or right(200)
  // opacity gradually changes to 0
  // and when the card is in center opacity = 1
  const opacityValue = useTransform(motionValue, [-150, 0, 150], [0, 1, 0]);

  const handleDragEnd = () => {
    if (Math.abs(motionValue.get()) > 100) {
      // get rid of the frontcard
      onSwipe();
    } else {
      motionValue.set(0);
    }
  };

  // framer animation hook
  const animControls = useAnimation();

  // when the card is swiped to left or right
  useEffect(() => {
    if (triggerSwipe) {
      animControls
        .start({ x: triggerSwipe === "left" ? -200 : 200 })
        .then(() => {
          onSwipe();
        });
    }
  }, [triggerSwipe, onSwipe, animControls]);
  return (
    <motion.div
      className={`match-profile ${isActive ? "active" : ""}`}
      drag="x"
      style={{ x: motionValue, rotate: rotateValue, opacity: opacityValue }}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={animControls}
    >
      <div className="profile-picture">
        <img src={imgSrc} alt="profile picture" />
      </div>
      <h1 className="match-username">{username}</h1>

      {/** second part of the card: top games and type of player */}
      <div className="profile-information">
        {/** top games */}
        <div className="top-games">
          <h2>Top Games</h2>
          {topGames.map((game, index) => (
            <p key={index}>{game}</p>
          ))}
        </div>

        {/** type of player */}
        <div className="Player-Type">
          <h2>Player Type</h2>
          {playerType.map((type, index) => (
            <p key={index}>{type}</p>
          ))}
        </div>
      </div>

      {/** third part the match card information: description */}
      <div className="description-container">
        <h2>Description</h2>
        <p>{description}</p>
      </div>
    </motion.div>
  );
};

const DecisionButton = ({ imgSrc, text, onClick, name }) => {
  return (
    <button className="decision-button" onClick={onClick}>
      {imgSrc && <img src={imgSrc} alt="button icon" />}
      {text}
    </button>
  );
};

const DuoMatchmakerPage = () => {
  const [triggerSwipe, setTriggerSwipe] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [userPreferences, setUserPreferences] = useState(null);
  const [profilesData, setProfilesData] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get("api/matchmaker/", {
          params: {
            username: "gamer123",
            Top5Games: "Apex Legends,Fortnite,PUBG,Valorant,Overwatch",
            PlayerType:
              "Supportive/Backline, Exclusive(1 or 2 games at a time), Casual, Never, 1-3 Hours",
            PlayerTypeInts: "3, 2, 4, 3, 1",
            Description: "Looking for a duo partner",
          },
        });
        console.log("API response:", response.data); // Log the API response

        if (response.data && response.data.Matches) {
          // Ensure playertype and top5games are arrays and clean up playertype
          const formattedProfiles = response.data.Matches.map((profile) => ({
            ...profile,
            playertype: profile.playertype.map((type) =>
              type.replace(/[\[\]]/g, "").trim()
            ),
            top5games: Array.isArray(profile.top5games)
              ? profile.top5games
              : profile.top5games.split(", "),
            playertypeints: JSON.parse(profile.playertypeints),
          }));
          setProfilesData(formattedProfiles);
        } else {
          console.error("No matches found in the API response");
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };
    fetchProfiles();
  }, []);

  const handleSwipe = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % profilesData.length);
  };
  const handlePreferencesSubmit = (preferences) => {
    setUserPreferences(preferences);
  };

  return (
    <div className="page-layout">
      {userPreferences ? (
        <div className="matches-layout">
          <DecisionButton
            text="GAME OVER"
            onClick={() => setTriggerSwipe("left")}
          />
          <div className="match-profiles-container">
            {profilesData && profilesData.length > 0 ? (
              profilesData.map((profile, index) => (
                <MatchProfileCard
                  key={index}
                  imgSrc={profile.imgSrc}
                  username={profile.username}
                  topGames={profile.top5games}
                  playerType={profile.playertype}
                  description={profile.description}
                  isActive={index === activeIndex}
                  onSwipe={handleSwipe}
                  triggerSwipe={triggerSwipe}
                />
              ))
            ) : (
              <p>No profiles available</p>
            )}
          </div>
          <div className="Yes-match">
            <DecisionButton
              text="GAME ON"
              onClick={() => setTriggerSwipe(!"left")}
            />
          </div>
        </div>
      ) : (
        <PreferencesForm onSubmit={handlePreferencesSubmit} />
      )}
    </div>
  );
};

export default DuoMatchmakerPage;
