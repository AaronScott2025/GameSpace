import React from "react";
import PreferencesForm from "../components/matchmaking-components/match-form";
import { useState } from "react";
function MatchmakingFormPage() {
  const [userPreferences, setUserPreferences] = useState(null);

  const handlePreferencesSubmit = (preferences) => {
    setUserPreferences(preferences);
  };
  return (
    <>
      <PreferencesForm onSubmit={handlePreferencesSubmit} />
    </>
  );
}

export default MatchmakingFormPage;
