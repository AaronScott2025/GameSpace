import React, { use, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";
import RadioButton from "../components/Radio-button";
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
  const [isFirstTime, setIsFirstTime] = useState(
    !localStorage.getItem("preferences")
  );

  const profilesData = [
    {
      imgSrc:
        "https://upload.wikimedia.org/wikipedia/commons/c/c3/The_Rock_2023.jpg",
      username: "The Rock",
      topGames: ["League of Legends", "Valorant", "Overwatch"],
      playerType: ["Competitive", "Casual", "Chill"],
      description:
        "I am a competitive player who is looking for a duo partner to climb the ranks with. I am currently in gold and looking to reach plat by the end of the season.",
    },
    {
      imgSrc:
        "https://upload.wikimedia.org/wikipedia/commons/8/89/Scarlett_Johansson_by_Gage_Skidmore_2.jpg",
      username: "Scarlett",
      topGames: ["Fortnite", "Apex Legends", "PUBG"],
      playerType: ["Casual", "Strategic", "Team Player"],
      description:
        "I enjoy playing battle royale games and am looking for a team player to strategize and win matches together.",
    },
    {
      imgSrc:
        "https://upload.wikimedia.org/wikipedia/commons/1/1e/Chris_Hemsworth_by_Gage_Skidmore.jpg",
      username: "Thor",
      topGames: ["God of War", "Assassin's Creed", "The Witcher 3"],
      playerType: ["Story-driven", "Explorer", "Adventurer"],
      description:
        "I love story-driven games and exploring vast open worlds. Looking for someone who shares the same passion for epic adventures.",
    },
  ];

  const handleSwipe = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % profilesData.length);
  };

  const handlePreferencesSubmit = (preferences) => {
    const data = localStorage.setItem(
      "preferences",
      JSON.stringify(preferences)
    );
    console.log(data);
    setIsFirstTime(false);
  };

  return (
    <div className="page-layout">
      {isFirstTime ? (
        <PreferencesForm onSubmit={handlePreferencesSubmit} />
      ) : (
        <>
          <DecisionButton
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
        </>
      )}
    </div>
  );
};

export default DuoMatchmakerPage;
