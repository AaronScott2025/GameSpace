import React from "react";
import "../styles/duo-matchmaker-page.css";
import { supabase } from "../../client";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { useNavigate, Outlet } from "react-router-dom";

import { FaUsers } from "react-icons/fa6";
function MatchmakingFormPage() {
  const { user } = useContext(UserContext); // Get the logged-in user's email from context
  const [isFirstTime, setIsFirstTime] = useState(null); // Track if it's the user's first time
  const [loading, setLoading] = useState(true); // Track loading state
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        // Fetch the current user's data from the Supabase table
        const { data, error } = await supabase
          .from("duo_matchmaker")
          .select("is_first_time")
          .eq("username", user?.username) // Use the logged-in user's email
          .single();

        if (error) {
          console.error("Error fetching user status:", error);
        } else {
          setIsFirstTime(data.is_first_time); // Set the value of is_first_time
        }
      } catch (error) {
        console.error("Unexpected error fetching user status:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUserStatus();
  }, []);

  const navigate = useNavigate();
  const handleNavigate = () => {
    if (isFirstTime === true) {
      navigate("/matchmaking-form"); // Navigate to the form if it's the user's first time
    } else if (isFirstTime === false) {
      navigate("/matches"); // Navigate to matches otherwise
    }
  };

  if (loading) {
    // Show a loading state while fetching user status
    return <p>Loading...</p>;
  }

  return (
    <div className="matchmaking-form-page">
      <div className="title-description">
        <h1 className="info-title">
          <FaUsers />
          Party Finder
        </h1>

        <p>
          Welcome to the Party Finder! This feature helps you connect with other
          gamers who share your interests and play style. Whether you're looking
          for a competitive teammate, casual gaming buddy, or just someone to
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
        <p>
          ready to find your perfect gaming partner? Click the button below to
          get started!
        </p>
        <button className="start-button" onClick={handleNavigate}>
          Start Finding Your Party
        </button>
      </div>
    </div>
  );
}

export default MatchmakingFormPage;
