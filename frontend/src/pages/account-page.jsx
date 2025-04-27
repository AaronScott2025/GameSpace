import { useContext, useEffect, useState } from "react";
import "/src/styles/account-page.css";
import {
  getUserInfo,
  handleGameSelection,
  updateUserPassword,
  uploadProfilePic,
  updateLinkedServices,
  updateUserBio,
  generateProfilePic,
  generateUsername,
  getFavoriteGames,
  removeFavoriteGame,
} from "../scripts/account-page-scripts";
import { UserContext } from "./UserContext.jsx";
import defaultProfilePic from "../assets/default_pfp.jpg";
import LoadingAnimation from "../components/loading-animation.jsx";
import { RiAiGenerate2 } from "react-icons/ri";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import FavoriteGamesPopUp from "../components/favoriteGamesPopUp.jsx";

const AccountPage = () => {
  const { user } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(defaultProfilePic);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [bio, setBio] = useState("");
  const [steam, setSteam] = useState("");
  const [epicGames, setEpicGames] = useState("");
  const [psn, setPsn] = useState("");
  const [xbox, setXbox] = useState("");
  const [discord, setDiscord] = useState("");
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [usernamePrompt, setUsernamePrompt] = useState("");
  const [isUsernameGenerating, setIsUsernameGenerating] = useState(false);
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);

  const [favoriteGames, setFavoriteGames] = useState({});
  const [showGamePopup, setShowGamePopup] = useState(false);
  const [currentGameSlot, setCurrentGameSlot] = useState(null);

  useEffect(() => {
    const loadUserInfo = async () => {
      setLoading(true);
      setError("");
      try {
        const userInfo = await getUserInfo(user.id);
        if (userInfo) {
          setUsername(userInfo.username || "");
          setEmail(userInfo.email || "");
          setProfilePic(userInfo.profile_pic || defaultProfilePic);
          setBio(userInfo.bio || "");
          setSteam(userInfo.steam_link || "");
          setEpicGames(userInfo.Epic_link || "");
          setPsn(userInfo.PSN_link || "");
          setXbox(userInfo.Xbox_link || "");
          setDiscord(userInfo.Discord_link || "");

          // Load favorite games
          const games = await getFavoriteGames(user.id, userInfo.username);
          if (games) {
            setFavoriteGames(games);
          }
        } else {
          setError("Unable to load user information.");
        }
      } catch (err) {
        setError("An error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };
    loadUserInfo();
  }, [user?.id]);

  // Preserve all original functions
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const success = await updateUserPassword(newPassword);
    if (success) {
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordChange(false);
      setError("");
    } else {
      setError("Failed to update password.");
    }
  };

  const handleProfilePicUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setLoading(true);
    const uploadedUrl = await uploadProfilePic(user.id, file);
    if (uploadedUrl) {
      setProfilePic(uploadedUrl);
      console.log("Profile picture updated:", uploadedUrl);
    } else {
      setError("Failed to upload profile picture.");
    }
    setLoading(false);
  };

  const handleGenerateProfilePic = async (prompt) => {
    try {
      const newProfilePic = await generateProfilePic(user.id, prompt);

      if (newProfilePic) {
        console.log("Generated profile picture URL:", newProfilePic);
        setProfilePic(newProfilePic);
        setPrompt("");
      } else {
        setError("Failed to generate profile picture.");
        console.error("Failed to generate profile picture.");
      }
    } catch (err) {
      console.error("Error generating profile picture:", err);
      setError("An error occurred while generating the profile picture.");
    }
  };

  const handleGenerateUsername = async (message) => {
    try {
      const newUsername = await generateUsername(user.id, message);
      if (newUsername) {
        console.log("Generated username:", newUsername);
        setUsername(newUsername);
        setUsernamePrompt("");
      } else {
        setError("Failed to generate username.");
        console.error("Failed to generate username.");
      }
    } catch (err) {
      console.error("Error generating username:", err);
      setError("An error occurred while generating the username.");
    } finally {
      setIsUsernameGenerating(false);
      setShowUsernamePrompt(false);
    }
  };

  const handleLinkedServicesUpdate = async () => {
    setLoading(true);
    const success = await updateLinkedServices(user.id, {
      steam_link: steam,
      Epic_link: epicGames,
      PSN_link: psn,
      Xbox_link: xbox,
      Discord_link: discord,
    });
    if (success) {
      console.log("Linked services updated successfully");
    } else {
      setError("Failed to update linked services.");
    }
    setLoading(false);
  };

  const handleBioUpdate = async () => {
    setLoading(true);
    const success = await updateUserBio(user.id, bio);
    if (success) {
      console.log("Bio updated successfully");
    } else {
      setError("Failed to update bio.");
    }
    setLoading(false);
  };

  const handleGameClick = (slotNumber) => {
    setCurrentGameSlot(slotNumber);
    setShowGamePopup(true);
  };

  const handleSelectGame = async (game, slotNumber) => {
    if (!game || !user.id || !username) return;

    setLoading(true);
    const result = await handleGameSelection(user.id, username, game.id, slotNumber);

    if (result.success) {
      setFavoriteGames(prev => {
        const newGames = { ...prev };
        newGames[slotNumber] = game;
        return newGames;
      });
    } else {
      setError("Failed to update favorite game.");
    }

    setLoading(false);
    setShowGamePopup(false);
  };

  const handleRemoveGame = async (slotNumber) => {
    if (!user.id || !username) return;

    setLoading(true);
    const success = await removeFavoriteGame(user.id, username, slotNumber);

    if (success) {
      // Update local state
      setFavoriteGames(prev => {
        const newGames = { ...prev };
        newGames[slotNumber] = null;
        return newGames;
      });
    } else {
      setError("Failed to remove favorite game.");
    }

    setLoading(false);
  };

  if (loading) {
    return <div className="loading">Loading user data...</div>;
  }

  return (
    <div className="content-container">
      <div className="account-page">

        <div className="profile-section">
          <div className="profile-picture">
            <img key={profilePic} src={profilePic} alt="Profile" />
          </div>
          <input
            id="profilePicInput"
            type="file"
            accept="image/*"
            onChange={handleProfilePicUpload}
            style={{ display: "none" }}
          />
          <input
            id="generatePicInput"
            type="button"
            value="Generate Profile Picture"
            onClick={handleGenerateProfilePic}
            style={{ display: "none" }}
          />
          <div className="Edit-or-genereate-pfp">
            <label htmlFor="profilePicInput" className="action-button">
              Edit Profile Picture
            </label>
            <label
              onClick={() => setShowPromptInput(!showPromptInput)}
              className="action-button"
            >
              Generate Profile Picture
            </label>
          </div>

          {showPromptInput && (
            <div className="prompt-input-container">
              {!isGenerating ? (
                <>
                  <input
                    type="text"
                    className="prompt-input"
                    placeholder="Enter prompt for profile picture generation"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <div className="prompt-input-buttons">
                    <button
                      className="action-button-generate"
                      onClick={async () => {
                        setIsGenerating(true);
                        await handleGenerateProfilePic(prompt);
                        setIsGenerating(false);
                        setShowPromptInput(false);
                      }}
                    >
                      Generate
                    </button>
                    <button
                      className="action-button-generate"
                      onClick={() => {
                        setPrompt("");
                        setShowPromptInput(false);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <LoadingAnimation />
              )}
            </div>
          )}
        </div>

        <div className="account-info-section">
          <div className="account-info-title">Account Settings</div>
          {error && <div className="error-message">{error}</div>}
          <div className="account-info-content">
            <div className="account-info-item">
              <div className="info-row">
                <label className="info-label">E-Mail</label>
                <input
                  type="text"
                  className="info-input"
                  placeholder="E-mail"
                  value={email}
                  disabled
                />
              </div>
              <div className="info-row">
                <label className="info-label">Username</label>
                <div className="tooltip-container">
                  <RiAiGenerate2
                    size={23}
                    className="generate-icon"
                    data-tooltip-id="generate-icon-tooltip"
                    onClick={() => {
                      setShowUsernamePrompt(!showUsernamePrompt);
                    }}
                  />
                  <Tooltip
                    id="generate-icon-tooltip"
                    place="top"
                    content="Generate a new Username"
                    type="dark"
                    effect="solid"
                  />
                </div>

                <input
                  type="text"
                  className="info-input"
                  placeholder="Username"
                  value={username}
                  disabled
                />
              </div>
              {
                showUsernamePrompt && (
                  <div className="prompt-input-container">
                    {" "}
                    {!isUsernameGenerating ? (
                      <>
                        <input
                          type="text"
                          className="prompt-input"
                          placeholder="Enter a prompt to generate a username"
                          value={usernamePrompt}
                          onChange={(e) => setUsernamePrompt(e.target.value)}
                        />
                        <div className="prompt-input-buttons">
                          {" "}
                          <button
                            className="action-button-generate"
                            onClick={() =>
                              handleGenerateUsername(usernamePrompt)
                            }
                            disabled={isUsernameGenerating}
                          >
                            Generate
                          </button>
                          <button
                            className="action-button-generate"
                            onClick={() => setShowUsernamePrompt(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <LoadingAnimation />
                    )}
                  </div>
                )
              }

              <div className="info-row" style={{ justifyContent: "center" }}>
                {!showPasswordChange && (
                  <span
                    className="change-password-text"
                    onClick={() => setShowPasswordChange(true)}
                  >
                    Change Password?
                  </span>
                )}
              </div>
              {showPasswordChange && (
                <div className="password-change-section">
                  <div className="password-input-container">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className="info-input"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <span
                      className="toggle-password-icon"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? "Hide" : "Show"}
                    </span>
                  </div>
                  <div className="password-input-container">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className="info-input"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span
                      className="toggle-password-icon"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? "Hide" : "Show"}
                    </span>
                  </div>
                  <div className="password-buttons">
                    <button
                      className="action-button"
                      onClick={handlePasswordChange}
                    >
                      Submit Password Change
                    </button>
                    <button
                      className="action-button cancel-button"
                      onClick={() => {
                        setShowPasswordChange(false);
                        setError("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="linked-services-title">Linked Services</div>
          <div className="linked-services-content">
            <div className="linked-services-item">
              <div className="info-row">
                <label className="info-label">Steam</label>
                <input
                  type="text"
                  className="info-input"
                  placeholder="Steam"
                  value={steam}
                  onChange={(e) => setSteam(e.target.value)}
                />
              </div>
              <div className="info-row">
                <label className="info-label">Epic Games</label>
                <input
                  type="text"
                  className="info-input"
                  placeholder="Epic Games"
                  value={epicGames}
                  onChange={(e) => setEpicGames(e.target.value)}
                />
              </div>
              <div className="info-row">
                <label className="info-label">PSN</label>
                <input
                  type="text"
                  className="info-input"
                  placeholder="PSN"
                  value={psn}
                  onChange={(e) => setPsn(e.target.value)}
                />
              </div>
              <div className="info-row">
                <label className="info-label">X-Box</label>
                <input
                  type="text"
                  className="info-input"
                  placeholder="Xbox"
                  value={xbox}
                  onChange={(e) => setXbox(e.target.value)}
                />
              </div>
              <div className="info-row">
                <label className="info-label">Discord</label>
                <input
                  type="text"
                  className="info-input"
                  placeholder="Discord"
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                />
              </div>
              <div className="info-row" style={{ justifyContent: "center" }}>
                <button
                  className="action-button"
                  onClick={handleLinkedServicesUpdate}
                >
                  Save Linked Services
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bio-section">
          <div className="bio-title">Bio</div>
          <div className="bio-content">
            <textarea
              className="bio-input"
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
            <button
              className="action-button"
              onClick={handleBioUpdate}
              style={{ marginTop: "10px" }}
            >
              Save Bio
            </button>
          </div>
        </div>

        <div className="favoriteGames-section">
          <div className="favoriteGames-title">Favorite Games</div>
          <div className="favoriteGames-content">
            {[1, 2, 3, 4, 5, 6].map((slot) => (
              <div key={slot} className="favorite-game-container">
                <div
                  className={`favorite-game ${favoriteGames[slot] ? 'has-game' : ''}`}
                  onClick={() => handleGameClick(slot)}
                >
                  {favoriteGames[slot] ? (
                    <>
                      {favoriteGames[slot].cover_art_url ? (
                        <img
                          src={favoriteGames[slot].cover_art_url}
                          alt={favoriteGames[slot].title}
                        />
                      ) : (
                        <div className="game-placeholder">
                          {favoriteGames[slot].title.charAt(0)}
                        </div>
                      )}
                      <div className="game-title-overlay">
                        <span>{favoriteGames[slot].title}</span>
                      </div>
                      <button
                        className="remove-game-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveGame(slot);
                        }}
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <div className="add-game-placeholder">
                      <span className="add-icon">+</span>
                      <span className="add-text">Add Game</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="marketplace-section">
          <div className="marketplace-title">Marketplace</div>
        </div>
      </div>

      <FavoriteGamesPopUp
        isOpen={showGamePopup}
        onClose={() => setShowGamePopup(false)}
        onSelectGame={handleSelectGame}
        gameSlot={currentGameSlot}
      />
    </div>
  );
};

export default AccountPage;