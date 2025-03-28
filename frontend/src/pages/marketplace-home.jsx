import React from "react";
import "../styles/marketplace-home.css";

const GameListing = ({ game }) => {
  if (!game) {
    return (
      <div className="game-card placeholder">
        <p>Game unavailable</p>
      </div>
    );
  }
  return (
    <div className="game-card">
      <div className="game-poster">
        <p>Poster</p>
      </div>
      <div className="game-info">
        <h3>{game.title}</h3>
        <p className="price">${game.price}</p>
      </div>
    </div>
  );
};

const Marketplace = () => {
  const games = [
    {
      id: 1,
      title: "Pokemon Black 2",
      price: "129.99",
    },
      null,
    {
      id: 3,
      title: "Resident Evil 2",
      price: "49.99",
    },

    {
      id: 4,
      title: "Metal Gear Solid 3",
      price: "19.99",
    },
  ];

  return (
    <div className="marketplace-container">
      <section className="product-listings">
        <div className="product-listings-grid">
          {games.map((game, index) => (
            <GameListing key={game?.id || `placeholder-${index}`} game={game} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Marketplace;