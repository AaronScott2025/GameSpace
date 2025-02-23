import React from 'react';

const AccountPage = () => {
    return (
        <div classname="account-page">
            
        
            
            <div className="pfp-section">
                <div className="pfp-img"></div>
                <div className="edit-img"></div>
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




        </div>
    );
};

export default AccountPage;