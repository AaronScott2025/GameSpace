import React, { useState, useEffect } from "react";
import "../styles/marketplace-home.css";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_REACT_APP_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_REACT_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
        {game.cover_art_url ? (
          <img
            src={game.cover_art_url}
            alt={`${game.title} cover art`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <p>No Image</p>
        )}
      </div>
      <div className="game-info">
        <h3>{game.title}</h3>
        <p className="price">${game.price}</p>
      </div>
    </div>
  );
};

const Marketplace = () => {
  const [games, setGames] = useState([]);
  const [visibleCount, setVisibleCount] = useState(16);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      try {
        console.log('Supabase URL:', supabaseUrl);
        console.log('Attempting to fetch games...');

        const { data, error } = await supabase
          .from('games')
          .select('id, title, price, cover_art_url');

        console.log('Fetch result:', { data, error });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.warn('No games found');
        }

        setGames(data || []);
        setIsLoading(false);
      } catch (err) {
        console.error('Error in fetchGames:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 12);
  };

  const visibleGames = games.slice(0, visibleCount);

  if (isLoading) {
    return (
      <div className="marketplace-container">
        <p>Loading games...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="marketplace-container">
        <p>Error loading games: {error}</p>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="marketplace-container">
        <p>No games found in the database.</p>
      </div>
    );
  }

  return (
    <div className="marketplace-container">
      <section className="product-listings">
        <div className="product-listings-grid">
          {visibleGames.map((game) => (
            <GameListing key={game.id} game={game} />
          ))}
        </div>
        {visibleCount < games.length && (
          <div className="load-more-container">
            <button onClick={handleLoadMore}>Load More</button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Marketplace;