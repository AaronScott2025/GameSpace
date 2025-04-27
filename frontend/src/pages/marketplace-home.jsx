import React, { useState, useEffect } from "react";
import "../styles/marketplace-home.css";
import { supabase } from "../../client.js"; // Shared client
import FilterSection from "./marketplace_filter.jsx";
import { Link } from "react-router-dom";

const ListingCard = ({ listing }) => {
  if (!listing) {
    return (
      <div className="listing-card placeholder">
        <p>Listing unavailable</p>
      </div>
    );
  }
  return (
    <div className="listing-card">
      <div className="listing-picture">
        {listing.picture ? (
          <img
            src={listing.picture}
            alt={`${listing.title} image`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <p>No Image</p>
        )}
      </div>
      <div className="listing-info">
        <h3>{listing.title}</h3>
        <div className="seller-price">
          <span className="seller">{listing.username}</span>
          <span className="price">${listing.listing_price}</span>
        </div>
      </div>
    </div>
  );
};

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [loadIncrement, setLoadIncrement] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to determine how many listings to show based on screen width
  const calculateListingsToShow = () => {
    const width = window.innerWidth;
    if (width >= 1900) return 24;
    else if (width >= 1600) return 20;
    else if (width >= 1200) return 16;
    else if (width >= 768) return 12;
    else return 8;
  };

  // Function to determine load increment based on screen width
  const calculateLoadIncrement = () => {
    const width = window.innerWidth;
    if (width >= 1900) return 18;
    else if (width >= 1600) return 15;
    else if (width >= 1200) return 12;
    else return 9;
  };

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(calculateListingsToShow());
      setLoadIncrement(calculateLoadIncrement());
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch listings data from the "listings" table and include username
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching listings...");
        const { data, error } = await supabase
          .from("listings")
          .select("listing_id, title, listing_price, picture, username");

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.warn("No listings found");
        }

        setListings(data || []);
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + loadIncrement);
  };

  const visibleListings = listings.slice(0, visibleCount);

  if (isLoading) {
    return (
      <div className="marketplace-container">
        <p>Loading listings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="marketplace-container">
        <p>Error loading listings: {error}</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="marketplace-container">
        <p>No listings found in the database.</p>
      </div>
    );
  }

  return (
    <div className="marketplace-container">
      <FilterSection />
      <div className="product-listings-wrapper">
        <section className="product-listings">
          <div className="product-listings-grid">
            {visibleListings.map((listing) => (
              <Link
                to={`/item/${listing.listing_id}`}
                key={listing.listing_id}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListingCard listing={listing} />
              </Link>
            ))}
          </div>
        </section>
        {visibleCount < listings.length && (
          <div className="load-more-container">
            <button onClick={handleLoadMore}>Load More</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
