import { useContext, useEffect, useState } from 'react';
import '/src/styles/account-page.css';
import {
    getUserInfo,
    handleGameSelection,
    updateUserPassword,
    uploadProfilePic,
    updateLinkedServices,
    updateUserBio,
} from '../scripts/account-page-scripts';
import { UserContext } from "./UserContext.jsx";
import defaultProfilePic from '../assets/default_pfp.jpg';

const AccountPage = () => {
    const { user } = useContext(UserContext);

    // Declare all hooks unconditionally
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [profilePic, setProfilePic] = useState(defaultProfilePic);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [bio, setBio] = useState('');
    const [steam, setSteam] = useState('');
    const [epicGames, setEpicGames] = useState('');
    const [psn, setPsn] = useState('');
    const [xbox, setXbox] = useState('');
    const [discord, setDiscord] = useState('');


    useEffect(() => {
        const loadUserInfo = async () => {
            setLoading(true);
            setError('');
            try {
                const userInfo = await getUserInfo(user.id);
                if (userInfo) {
                    setUsername(userInfo.username || '');
                    setEmail(userInfo.email || '');
                    setProfilePic(userInfo.profile_pic || defaultProfilePic);
                    setBio(userInfo.bio || '');
                    setSteam(userInfo.steam_link || '');
                    setEpicGames(userInfo.Epic_link || '');
                    setPsn(userInfo.PSN_link || '');
                    setXbox(userInfo.Xbox_link || '');
                    setDiscord(userInfo.Discord_link || '');
                } else {
                    setError('Unable to load user information.');
                }
            } catch (err) {
                setError('An error occurred while fetching user data.');
            } finally {
                setLoading(false);
            }
        };
        loadUserInfo();
    }, [user?.id]);

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        const success = await updateUserPassword(newPassword);
        if (success) {
            setNewPassword('');
            setConfirmPassword('');
            setShowPasswordChange(false);
            setError('');
        } else {
            setError('Failed to update password.');
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
            setError('Failed to upload profile picture.');
        }
        setLoading(false);
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
            setError('Failed to update linked services.');
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

    if (loading) {
        return <div className="loading">Loading user data...</div>;
    }

    return (
        <div className="content-container">
            <div className="account-page">
                <div className="profile-section">
                    <div className="profile-picture">
                        <img src={profilePic} alt="Profile" />
                    </div>
                    <input
                        id="profilePicInput"
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicUpload}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="profilePicInput" className="action-button">
                        Edit Profile Picture
                    </label>
                </div>

                <div className="account-info-section">
                    <div className="account-info-title">Account Settings</div>
                    {error && <div className="error-message">{error}</div>}
                    <div className="account-info-content">
                        <div className="account-info-item">
                            <div className="info-row">
                                <label className="info-label">E-Mail</label>
                                <input type="text" className="info-input" placeholder="E-mail" value={email} disabled />
                            </div>
                            <div className="info-row">
                                <label className="info-label">Username</label>
                                <input type="text" className="info-input" placeholder="Username" value={username} disabled />
                            </div>
                            <div className="info-row" style={{ justifyContent: 'center' }}>
                                {!showPasswordChange && (
                                    <span className="change-password-text" onClick={() => setShowPasswordChange(true)}>
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
                                        <span className="toggle-password-icon" onClick={() => setPasswordVisible(!passwordVisible)}>
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
                                        <span className="toggle-password-icon" onClick={() => setPasswordVisible(!passwordVisible)}>
                      {passwordVisible ? "Hide" : "Show"}
                    </span>
                                    </div>
                                    <div className="password-buttons">
                                        <button className="action-button" onClick={handlePasswordChange}>
                                            Submit Password Change
                                        </button>
                                        <button className="action-button cancel-button" onClick={() => {
                                            setShowPasswordChange(false);
                                            setError('');
                                        }}>
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
                                <input type="text" className="info-input" placeholder="Steam" value={steam} onChange={(e) => setSteam(e.target.value)} />
                            </div>
                            <div className="info-row">
                                <label className="info-label">Epic Games</label>
                                <input type="text" className="info-input" placeholder="Epic Games" value={epicGames} onChange={(e) => setEpicGames(e.target.value)} />
                            </div>
                            <div className="info-row">
                                <label className="info-label">PSN</label>
                                <input type="text" className="info-input" placeholder="PSN" value={psn} onChange={(e) => setPsn(e.target.value)} />
                            </div>
                            <div className="info-row">
                                <label className="info-label">X-Box</label>
                                <input type="text" className="info-input" placeholder="Xbox" value={xbox} onChange={(e) => setXbox(e.target.value)} />
                            </div>
                            <div className="info-row">
                                <label className="info-label">Discord</label>
                                <input type="text" className="info-input" placeholder="Discord" value={discord} onChange={(e) => setDiscord(e.target.value)} />
                            </div>
                            <div className="info-row" style={{ justifyContent: 'center' }}>
                                <button className="action-button" onClick={handleLinkedServicesUpdate}>
                                    Save Linked Services
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bio-section">
                    <div className="bio-title">Bio</div>
                    <div className="bio-content">
                        <textarea className="bio-input" placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
                        <button className="action-button" onClick={handleBioUpdate} style={{ marginTop: '10px' }}>
                            Save Bio
                        </button>
                    </div>
                </div>

                <div className="favoriteGames-section">
                    <div className="favoriteGames-title">Favorite Games</div>
                    <div className="favoriteGames-content">
                        {["Game 1", "Game 2", "Game 3", "Game 4", "Game 5", "Game 6"].map((game) => (
                            <div key={game} className="favorite-game" onClick={() => handleGameSelection(game)}>
                                <img src="" alt={game} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="marketplace-section">
                    <div className="marketplace-title">Marketplace</div>
                    {/* Marketplace content would go here */}
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
