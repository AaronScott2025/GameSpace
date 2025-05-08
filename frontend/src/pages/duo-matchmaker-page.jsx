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

const LeftButton = ({ onClick }) => {
  return (
    <button
      className="decision-button left-button"
      onClick={() => onClick("left")}
    >
      <img src="/path/to/left-arrow-icon.png" alt="Swipe Left" />
      Swipe Left
    </button>
  );
};

const RightButton = ({ onClick }) => {
  return (
    <button
      className="decision-button right-button"
      onClick={() => onClick("right")}
    >
      <img src="/path/to/right-arrow-icon.png" alt="Swipe Right" />
      Swipe Right
    </button>
  );
};

const DuoMatchmakerPage = () => {
  const { user } = useContext(UserContext);
  const [triggerSwipe, setTriggerSwipe] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [profilesData, setProfilesData] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data } = await axios.get("api/matchmaker/", {
          params: { username: user?.username },
        });

        console.log("API response:", data); // Log the API response

        if (data?.Matches) {
          const formattedProfiles = data.Matches.map((profile) => ({
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
          console.warn("No matches found in the API response");
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };
    fetchProfiles();
  }, [user?.username]);

  const handleSwipe = (direction) => {
    setTriggerSwipe(direction); // Trigger swipe animation for the active card
    setTimeout(() => {
      setTriggerSwipe(null); // Reset triggerSwipe after the animation
      setActiveIndex((prevIndex) => (prevIndex + 1) % profilesData.length); // Move to the next card
    }, 300); // Adjust timeout to match the swipe animation duration
  };

  return (
    <div className="page-layout">
      <div className="matches-layout">
        {" "}
        <LeftButton onClick={setTriggerSwipe} />
        <div className="match-profiles-container">
          {" "}
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
        <div className="decision-buttons">
          <RightButton onClick={setTriggerSwipe} />
        </div>
      </div>
    </div>
  );
};

export default DuoMatchmakerPage;
