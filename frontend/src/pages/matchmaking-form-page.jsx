import React from "react";
import MatchmakingForm from "../components/matchmaking-components/match-form";
import { useState } from "react";
function MatchmakingFormPage() {
  const [userPreferences, setUserPreferences] = useState(null);

  const handlePreferencesSubmit = (preferences) => {
    setUserPreferences(preferences);
  };
  return (
    <div className="matchmaking-form-page">
      <h1>Matchmaking Form</h1>
      <MatchmakingForm onSubmit={handlePreferencesSubmit} />
    </div>
  );
}

export default MatchmakingFormPage;
