import React, { useState, useEffect, useNavigate } from "react";
import "../styles/product-page.css";
import { createClient } from "@supabase/supabase-js";
import FilterSection from "./marketplace_filter.jsx";
import Navbar from "../components/nav-bar";
import "/src/styles/product-page.css";
import { useParams } from "react-router-dom";

const supabaseUrl = import.meta.env.VITE_SUPABASE_REACT_APP_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_REACT_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
const ProductPage = () => {
    const { id } = useParams(); // Get the game ID from URL params
    const [game, setGame] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
    // Fetch game details when the page loads
    useEffect(() => {
      const fetchGameDetails = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from("games")
            .select(
              `id, title, summary, release_date, cover_art_url, user_ratings, critic_ratings, esrb_rating, price, created_at`
            )
            .eq("id", id)
            .single(); // Fetch only one game by ID
  
          if (error) {
            throw error;
          }
  
          setGame(data);
          setIsLoading(false);
        } catch (err) {
          console.error("Error fetching game details:", err.message);
          setError("Failed to load game details.");
          setIsLoading(false);
        }
      };
  
      fetchGameDetails();
    }, [id]);
  
    // Loading state
    if (isLoading) {
      return (
        <div className="item-page-container">
          <p>Loading game details...</p>
        </div>
      );
    }
  
    // Error state
    if (error) {
      return (
        <div className="item-page-container">
          <p>{error}</p>
        </div>
      );
    }
  
    // Game not found
    if (!game) {
      return (
        <div className="item-page-container">
          <p>Game not found.</p>
        </div>
      );
    }
  
    // Format release date to a readable format
    const formatDate = (dateString) => {
      if (!dateString) return "Unknown release date";
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };
  
    return (

        <div className="item-page-layout">
        {/* Filter Section on the left */}
        <Navbar />
          <FilterSection />
  
      <div className="item-page-container">
        <div className="game-details-card">
          <div className="game-poster">
            {game.cover_art_url ? (
              <img
                src={game.cover_art_url}
                alt={`${game.title} cover art`}
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            ) : (
              <p>No Image Available</p>
            )}
          </div>
  
          <div className="game-info">
            <h2>{game.title}</h2>
            <p className="summary">{game.summary || "No summary available."}</p>
  
            <p className="release-date">
              <strong>Release Date:</strong> {formatDate(game.release_date)}
            </p>
  
            <p className="ratings">
              <strong>User Rating:</strong> {game.user_ratings || "N/A"} / 10
            </p>
            <p className="ratings">
              <strong>Critic Rating:</strong> {game.critic_ratings || "N/A"} / 100
            </p>
  
            <p className="esrb-rating">
              <strong>ESRB Rating:</strong> {game.esrb_rating || "Not Rated"}
            </p>
  
            <p className="price">
              <strong>Price:</strong> ${game.price ? game.price.toFixed(2) : "N/A"}
            </p>
  
            <p className="created-at">
              <strong>Added on:</strong> {formatDate(game.created_at)}
            </p>
          </div>
        </div>
      </div>
      </div>
    );
  };
  
  export default ProductPage;
