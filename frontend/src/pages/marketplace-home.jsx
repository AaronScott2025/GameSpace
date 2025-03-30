import React, { useState, useEffect } from "react";
import "../styles/marketplace-home.css";
import { createClient } from "@supabase/supabase-js";
import FilterSection from "./marketplace_filter.jsx";

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
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
  const [visibleCount, setVisibleCount] = useState(0);
  const [loadIncrement, setLoadIncrement] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to determine how many games to show based on screen width
  const calculateGamesToShow = () => {
    const width = window.innerWidth;

    if (width >= 1900) {
      return 24; // 6 columns x 4 rows for extra large screens
    } else if (width >= 1600) {
      return 20; // 5 columns x 4 rows for large screens
    } else if (width >= 1200) {
      return 16; // 4 columns x 4 rows for medium-large screens
    } else if (width >= 768) {
      return 12; // 3 columns x 4 rows for medium screens
    } else {
      return 8; // 2 columns x 4 rows or less for small screens
    }
  };

  // Function to determine load increment based on screen width
  const calculateLoadIncrement = () => {
    const width = window.innerWidth;

    if (width >= 1900) {
      return 18; // 6 columns x 3 rows
    } else if (width >= 1600) {
      return 15; // 5 columns x 3 rows
    } else if (width >= 1200) {
      return 12; // 4 columns x 3 rows
    } else {
      return 9; // 3 columns x 3 rows or less
    }
  };

  // Initial setup and resize handler
  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(calculateGamesToShow());
      setLoadIncrement(calculateLoadIncrement());
    };

    // Set initial values
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch games data
  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      try {
        console.log("Supabase URL:", supabaseUrl);
        console.log("Attempting to fetch games...");
        const { data, error } = await supabase
          .from("games")
          .select("id, title, price, cover_art_url");

        console.log("Fetch result:", { data, error });

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.warn("No games found");
        }

        setGames(data || []);
        setIsLoading(false);
      } catch (err) {
        console.error("Error in fetchGames:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + loadIncrement);
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
  <FilterSection />
  <div className="product-listings-wrapper">
    <section className="product-listings">
      <div className="product-listings-grid">
        {visibleGames.map((game) => (
          <GameListing key={game.id} game={game} />
        ))}
      </div>
    </section>
    {visibleCount < games.length && (
      <div className="load-more-container">
        <button onClick={handleLoadMore}>Load More</button>
      </div>
    )}
  </div>
</div>

  );
};

export default Marketplace;