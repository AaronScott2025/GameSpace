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
import "../styles/duo-matchmaker-page.css";

const PreferencesForm = ({ onSubmit }) => {
  const [preferences, setPreferences] = useState({
    playStyle: "",
    playerDescription: "",
    playerPersonality: "",
    micUsage: "",
    playTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  return (
    <div className="preferences-container">
      <div className="title-description">
        <h1 className="info-title">
          <GiSatelliteCommunication />
          party Finder
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
            you're not interested, or swipe right to connect with a gamer. If
            both of you swipe right, it's a match!
          </li>
          <li>
            <span className="highlight">Connect and Play:</span> Once matched,
            you can start chatting and plan your next gaming session together.
          </li>
        </ol>
      </div>
      <div className="preferences-form-container">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis quisquam
        sunt dignissimos nemo ad velit adipisci similique veniam obcaecati,
        commodi officia omnis saepe odit iure minus architecto veritatis
        consectetur laboriosam.
      </div>
      {/* <div className="preferences-form-container">
        <form onSubmit={handleSubmit} className="preferences-form">
          <label>
            Which of the following best describes your play style?
            <div>
              <RadioButton
                name="playStyle"
                options={[
                  "Supportive/Backline",
                  "Neutral/Middle",
                  "Neutral/Middle",
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
                value={preferences.micUsage}
                onChange={handleChange}
              />
            </div>
          </label>
          <button type="submit">Submit</button>
        </form>
      </div> */}
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
      <h1 className="username">{username}</h1>

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
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSwipe = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % profilesData.length);
  };

  return (
    <div className="page-layout">
      <PreferencesForm />
      {/* <div className="matches-layout"> */}
      {/* <DecisionButton
        imgSrc="https://banner2.cleanpng.com/20190512/xyi/kisspng-rainbow-flag-nail-art-pixel-gay-pride-5-percent-of-businesses-are-planning-to-break-up-1713893183862.webp"
        text="GAME OVER"
        onClick={() => setTriggerSwipe("left")}
      />
      <div className="match-profiles-container">
        {profilesData.map((profile, index) => (
          <MatchProfileCard
            key={index}
            imgSrc={profile.imgSrc}
            username={profile.username}
            topGames={profile.topGames}
            playerType={profile.playerType}
            description={profile.description}
            isActive={index === activeIndex}
            onSwipe={handleSwipe}
          />
        ))}
      </div>
      <div className="Yes-match">
        <DecisionButton
          imgSrc="https://banner2.cleanpng.com/20190512/xyi/kisspng-rainbow-flag-nail-art-pixel-gay-pride-5-percent-of-businesses-are-planning-to-break-up-1713893183862.webp"
          text="GAME ON"
          onClick={() => setTriggerSwipe("left")}
        />
      </div>
      <div className="screen-size">
        Screen Size: {screenSize.width} x {screenSize.height}
      </div> */}
    </div>
  );
};

export default DuoMatchmakerPage;
