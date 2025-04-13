import React, { useState, useEffect } from "react";
import "../styles/favoriteGamesPopUp.css";
import { supabase } from "../../client.js";

const FavoriteGamesPopUp = ({ isOpen, onClose, onSelectGame, gameSlot }) => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All" },
    { id: "action", name: "Action" },
    { id: "rpg", name: "RPG" },
    { id: "adventure", name: "Adventure" },
    { id: "sports", name: "Sports" },
    { id: "strategy", name: "Strategy" }
  ];

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("games")
          .select("id, title, cover_art_url");

        if (error) {
          console.error("Error fetching games:", error);
          throw error;
        }

        if (!data || data.length === 0) {
          const placeholderGames = generatePlaceholderGames();
          setGames(placeholderGames);
          setFilteredGames(placeholderGames);
        } else {
          setGames(data);
          setFilteredGames(data);
        }
      } catch (err) {
        console.error("Error in game fetch operation:", err);
        const placeholderGames = generatePlaceholderGames();
        setGames(placeholderGames);
        setFilteredGames(placeholderGames);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchGames();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = games.filter(game =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredGames(filtered);
    } else {
      setFilteredGames(games);
    }
  }, [searchQuery, games]);

  const handleSelectGame = (game) => {
    onSelectGame(game, gameSlot);
    onClose();
  };

  const generatePlaceholderGames = () => {
    const genres = ["Action", "Adventure", "RPG", "Strategy", "Sports", "Simulation"];
    return Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      title: `${genres[i % genres.length]} Game ${i + 1}`,
      cover_art_url: null
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="game-popup-overlay" onClick={onClose}>
      <div className="game-popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="game-popup-header">
          <h2>Select a Favorite Game</h2>
          <button className="game-popup-close" onClick={onClose}>&times;</button>
        </div>

        <div className="game-popup-toolbar">
          <div className="game-popup-search">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <nav className="game-popup-nav">
            {categories.map(category => (
              <button
                key={category.id}
                className={`game-popup-nav-item ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="game-popup-content">
          {isLoading ? (
            <div className="game-popup-loading">Loading games...</div>
          ) : filteredGames.length === 0 ? (
            <div className="game-popup-no-results">No games found</div>
          ) : (
            <div className="game-popup-grid">
              {filteredGames.map((game) => (
                <div
                  key={game.id}
                  className="game-popup-card"
                  onClick={() => handleSelectGame(game)}
                >
                  <div className="game-popup-image">
                    {game.cover_art_url ? (
                      <img
                        src={game.cover_art_url}
                        alt={`${game.title} cover`}
                      />
                    ) : (
                      <div className="game-popup-placeholder">
                        {game.title.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="game-popup-title">
                    {game.title}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoriteGamesPopUp;