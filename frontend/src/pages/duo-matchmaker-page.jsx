import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";
import { UserContext } from "./UserContext";
import "../styles/duo-matchmaker-page.css";
import axios from "axios";
import useStartConversation from "../hooks/conversation";
import { supabase } from "../../client";
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
  const motionValue = useMotionValue(0);
  const rotateValue = useTransform(motionValue, [-150, 150], [-18, 18]);
  const opacityValue = useTransform(motionValue, [-150, 0, 150], [0, 1, 0]);
  const animControls = useAnimation();

  const handleDragEnd = () => {
    if (Math.abs(motionValue.get()) > 100) {
      const direction = motionValue.get() > 0 ? "right" : "left";
      animControls
        .start({ x: direction === "right" ? 300 : -300, opacity: 0 })
        .then(() => {
          onSwipe(direction); // Notify parent to update the active card
        });
    } else {
      motionValue.set(0); // Reset position if swipe threshold is not met
    }
  };

  useEffect(() => {
    if (triggerSwipe) {
      animControls
        .start({
          x: triggerSwipe === "left" ? -300 : 300,
          opacity: 0,
        })
        .then(() => {
          onSwipe(triggerSwipe); // Notify parent to update the active card
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
        <img src={imgSrc || "pic.jpg"} alt="profile picture" />
      </div>
      <h1 className="match-username">{username}</h1>
      <div className="profile-information">
        <div className="top-games">
          <h2>Top Games</h2>
          {topGames.map((game, index) => (
            <p key={index}>{game}</p>
          ))}
        </div>
        <div className="Player-Type">
          <h2>Player Type</h2>
          {playerType.map((type, index) => (
            <p key={index}>{type}</p>
          ))}
        </div>
      </div>
      <div className="description-container">
        <h2>Description</h2>
        <p>{description}</p>
      </div>
    </motion.div>
  );
};

const LeftButton = ({ onClick }) => (
  <button
    className="decision-button left-button"
    onClick={() => onClick("left")}
  >
    <img src="edit.png" />
    Game Over
  </button>
);

const RightButton = ({ onClick }) => (
  <button
    className="decision-button right-button"
    onClick={() => onClick("right")}
  >
    <img src="edit-2.png" />
    Game Start
  </button>
);

const DuoMatchmakerPage = () => {
  const { user } = useContext(UserContext);
  const [profilesData, setProfilesData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [triggerSwipe, setTriggerSwipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const { startConversation } = useStartConversation(); // Import the startConversation function

  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get("api/matchmaker/", {
          params: { username: user?.username },
        });

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
          console.log("Fetched Matches:", formattedProfiles); // Log the matches
          setProfilesData(formattedProfiles);
        } else {
          console.warn("No matches found in the API response");
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch profiles if username is available
    if (user?.username) {
      fetchProfiles();
    }
  }, [user?.username]);

  const handleSwipe = async (direction) => {
    if (activeIndex >= profilesData.length) {
      console.log("No more profiles to swipe.");
      return;
    }

    setTriggerSwipe(direction);
    setTimeout(() => {
      setTriggerSwipe(null);
      setActiveIndex((prevIndex) => prevIndex + 1);
    }, 300);

    if (direction === "right") {
      const participantUsername = profilesData[activeIndex]?.username;

      console.log("Fetching participant ID for username:", participantUsername);

      try {
        const { data, error } = await supabase.rpc("get_user_id_by_username", {
          input_username: participantUsername,
        });

        console.log("RPC Response Data:", data);
        console.log("RPC Response Error:", error);

        if (error) {
          console.error("Error fetching participant ID:", error.message);
          alert("Failed to fetch participant information.");
          return;
        }

        const participantId = typeof data === "string" ? data : data?.user_id;

        console.log("Participant ID before check:", participantId);

        if (!participantId) {
          alert("This is a fake profile.");
          return;
        }

        console.log("Current User ID:", user.user_id);
        console.log("Participant User ID:", participantId);

        startConversation(user.user_id, participantId);
      } catch (err) {
        console.error("Unexpected error fetching participant ID:", err.message);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  const reloadMatches = () => {
    setProfilesData([]); // Clear the current profiles
    setActiveIndex(0); // Reset the active index
    setTriggerSwipe(null); // Reset swipe trigger
    // Explicitly call fetchProfiles to reload matches
    const fetchProfiles = async () => {
      setIsLoading(true); // Set loading state to true
      try {
        const { data } = await axios.get("api/matchmaker/", {
          params: { username: user?.username },
        });

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
          console.log("Fetched Matches:", formattedProfiles); // Log the matches
          setProfilesData(formattedProfiles);
        } else {
          console.warn("No matches found in the API response");
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setIsLoading(false); // Set loading state to false
      }
    };

    fetchProfiles(); // Fetch new profiles
  };
  const handleChangePreferences = () => {
    navigate("/matchmaking-form"); // Navigate to the matchmaking form
  };
  return (
    <div className="page-layout">
      <button
        onClick={handleChangePreferences}
        className="change-preferences-button"
      >
        Change Preferences
      </button>
      <div className="content-container">
        <div className="matches-layout">
          {activeIndex >= profilesData.length ? (
            <div className="no-more-matches">
              <p>No more matches available</p>
              <button onClick={reloadMatches} className="reload-button">
                Reload Matches
              </button>
            </div>
          ) : (
            <>
              <LeftButton onClick={() => handleSwipe("left")} />
              <div className="match-profiles-container">
                <AnimatePresence>
                  {profilesData.length > 0 &&
                    activeIndex < profilesData.length && (
                      <MatchProfileCard
                        key={activeIndex}
                        imgSrc={profilesData[activeIndex].imgSrc}
                        username={profilesData[activeIndex].username}
                        topGames={profilesData[activeIndex].top5games}
                        playerType={profilesData[activeIndex].playertype}
                        description={profilesData[activeIndex].description}
                        isActive={true}
                        onSwipe={() => setActiveIndex((prev) => prev + 1)}
                        triggerSwipe={triggerSwipe}
                      />
                    )}
                </AnimatePresence>
              </div>
              <RightButton onClick={() => handleSwipe("right")} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DuoMatchmakerPage;
