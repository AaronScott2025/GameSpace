import React, { useState, useEffect } from "react";
import "../styles/product-page.css";
import { supabase } from "../../client.js";
import FilterSection from "./marketplace_filter.jsx";
import Navbar from "../components/nav-bar";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  const { id } = useParams(); // 'id' represents the listing_id from the URL
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch listing details when the page loads
  useEffect(() => {
    const fetchListingDetails = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("listings")
          .select(
            "listing_id, title, username, listing_description, picture, listing_price, condition, created_at"
          )
          .eq("listing_id", id)
          .single();

        if (error) {
          throw error;
        }

        setListing(data);
      } catch (err) {
        console.error("Error fetching listing details:", err.message);
        setError("Failed to load listing details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListingDetails();
  }, [id]);

  // Loading state
  if (isLoading) {
    return (
      <div className="item-page-container">
        <p>Loading listing details...</p>
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

  // Listing not found
  if (!listing) {
    return (
      <div className="item-page-container">
        <p>Listing not found.</p>
      </div>
    );
  }

  // Format the date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
  <div className="item-page-layout">
    <Navbar />
    <FilterSection />
    <div className="item-page-container">
      <div className="item-detail-listing-card">
        <div className="item-detail-picture">
          {listing.picture ? (
            <img
              src={listing.picture}
              alt={`${listing.title} image`}
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
          ) : (
            <p>No Image Available</p>
          )}
        </div>
        <div className="item-detail-info">
          <h2>{listing.title}</h2>
          <p className="item-detail-description">
            {listing.listing_description || "No description available."}
          </p>
          <p className="item-detail-username">
            <strong>Seller:</strong> {listing.username}
          </p>
          <p className="item-detail-price">
            <strong>Price:</strong> $
            {listing.listing_price
              ? listing.listing_price.toFixed(2)
              : "N/A"}
          </p>
          <p className="item-detail-condition">
            <strong>Condition:</strong> {listing.condition || "N/A"}
          </p>
          <p className="item-detail-created-at">
            <strong>Listed on:</strong> {formatDate(listing.created_at)}
          </p>
        </div>
      </div>
    </div>
  </div>
);
};

export default ProductPage;
