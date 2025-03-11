import React from 'react';
import '/src/Styles/account-page.css'; 


const AccountPage = () => {
    return (
        <div className="account-page">


            <div className="profile-section">
                <div className="profile-picture"></div>
                <div className="profile-edit">
                    <span className="profile-edit-label">Edit Profile Picture</span>
                </div>
            </div>
            
            <div className="account-info-section">
                <div className="account-info-title">Account Settings</div>
                <div className="account-info-content">
                    <div className="account-info-item">
                        <div className="info-row">
                            <label className="info-label">E-Mail</label>
                            <input type="text" className="info-input" placeholder="E-mail" />
                        </div>
                        <div className="info-row">
                            <label className="info-label">Username</label>
                            <input type="text" className="info-input" placeholder="Username" />
                        </div>
                        <div className="info-row">
                            <label className="info-label">Password</label>
                            <input type="password" className="info-input" placeholder="Password" />
                        </div>
                    </div>
                </div>
                <div className="linked-services-title">Linked Services</div>
                <div className="linked-services-content">
                    <div className="linked-services-item">
                        <div className="info-row">
                            <label className="info-label">Steam</label>
                            <input type="text" className="info-input" placeholder="Steam" />
                        </div>
                        <div className="info-row">
                            <label className="info-label">Epic Games</label>
                            <input type="text" className="info-input" placeholder="Epic Games" />
                        </div>
                        <div className="info-row">
                            <label className="info-label">PSN</label>
                            <input type="text" className="info-input" placeholder="PSN" />
                        </div>
                        <div className="info-row">
                            <label className="info-label">X-Box</label>
                            <input type="text" className="info-input" placeholder="Xbox " />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bio-section">
                <div className="bio-title">Bio</div>
                <div className="bio-content">
                    <textarea className="bio-input" placeholder="Bio" ></textarea>
                </div>
            </div>
            
            <div className="favoriteGames-section">
                <div className="favoriteGames-title">Favorite Games</div>
                <div className="favoriteGames-content">
                    <img src="" alt="Game 1" />
                    <img src="" alt="Game 2" />
                    <img src="" alt="Game 3" />
                    <img src="" alt="Game 4" />
                    <img src="" alt="Game 5" />
                    <img src="" alt="Game 6" />
                </div>
            </div>
            
            <div className="marketplace-section">
                <div className="marketplace-title">Marketplace</div>
            </div>

            
        </div>
    );
};

export default AccountPage;