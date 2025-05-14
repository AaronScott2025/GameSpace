import React from "react";
import "../styles/account-page.css";
import FavoriteGamesPopUp from "./favoriteGamesPopUp.jsx";
// Add styles if needed

const FavoriteGamesSection = ({
  favoriteGames = {}, // Default to an empty object
  handleGameClick,
  handleRemoveGame,
  showGamePopup,
  setShowGamePopup,
  handleSelectGame,
  currentGameSlot,
}) => {
  return (
    <div className="favoriteGames-section">
      <div className="favoriteGames-title">Favorite Games</div>
      <div className="favoriteGames-content">
        {[1, 2, 3, 4, 5, 6].map((slot) => (
          <div key={slot} className="favorite-game-container">
            <div
              className={`favorite-game ${
                favoriteGames[slot] ? "has-game" : ""
              }`}
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
      <FavoriteGamesPopUp
        isOpen={showGamePopup}
        onClose={() => setShowGamePopup(false)}
        onSelectGame={handleSelectGame}
        gameSlot={currentGameSlot}
      />
    </div>
  );
};
export default FavoriteGamesSection;
