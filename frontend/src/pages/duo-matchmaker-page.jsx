import React from "react";
import "./duo-matchmaker-page.css";

const DuoMatchmakerPage = () => {
  return (
    <div className="page-layout">
      {/** this the match card information */}
      <div className="match-profile">
        <div className="profile-picture">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c3/The_Rock_2023.jpg"
            alt="profile picture"
          />
        </div>
        <h1 className="username"> your mom</h1>

        {/** second part of the card: top games and type of player */}
        <div className="profile-information">
          {/** top games */}
          <div className="top-games">
            <h2>Top Games</h2>
            <p>League of Legends</p>
            <p>Valorant</p>
            <p>Overwatch</p>
          </div>

          {/** type of player */}
          <div className="Player-Type">
            <h2>Player Type</h2>
            <p>Competitive</p>
            <p>Chill</p>
            <p>Tryhard</p>
          </div>
        </div>

        {/** third part the match card information: description */}
        <div className="description-container">
          <h2>Description</h2>
          <p>
            I am a competitive player who is looking for a duo partner to climb
            the ranks with. I am currently in gold and looking to reach plat by
            the end of the season.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DuoMatchmakerPage;
