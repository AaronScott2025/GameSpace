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

  // Extract up to 3 tags to display
  const displayTags = listing.tags ? listing.tags.slice(0, 3) : [];

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
        {displayTags && displayTags.length > 0 && (
          <div className="listing-tags">
            {displayTags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Marketplace = () => {
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [loadIncrement, setLoadIncrement] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Combined search state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);

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

  // Fetch listings data from the "listings" table including username and tags
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching listings...");
        const { data, error } = await supabase
          .from("listings")
          .select("listing_id, title, listing_price, picture, username, tags, condition, listing_description");

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.warn("No listings found");
        }

        setAllListings(data || []);
        setFilteredListings(data || []);
        setVisibleCount(calculateListingsToShow());
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Combined search and filter logic
  useEffect(() => {
    if (!allListings.length) return;

    let filtered = [...allListings];

    // Apply search query if exists (search in title, description, and tags)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(listing => {
        // Search in title and username
        const titleMatch = listing.title?.toLowerCase().includes(query);
        const usernameMatch = listing.username?.toLowerCase().includes(query);
        const descriptionMatch = listing.listing_description?.toLowerCase().includes(query);

        // Search in tags
        const tagMatch = listing.tags?.some(tag =>
          tag.toLowerCase().includes(query)
        );

        return titleMatch || usernameMatch || descriptionMatch || tagMatch;
      });
    }

    // Apply tag filters if any exist
    if (activeFilters.length > 0) {
      filtered = filtered.filter(listing => {
        if (!listing.tags) return false;

        // Check if listing has at least one of the active filter tags
        return activeFilters.some(filter =>
          listing.tags.some(tag => tag.toLowerCase() === filter.toLowerCase())
        );
      });
    }

    setFilteredListings(filtered);
    // Reset visible count when filters change
    setVisibleCount(calculateListingsToShow());
  }, [searchQuery, activeFilters, allListings]);

  // Handler for search input from FilterSection
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Handler for tag selection from FilterSection
  const handleTagSelect = (tag) => {
    if (!tag) return;

    // Toggle the tag in active filters
    setActiveFilters(prev => {
      // If the tag is already in the filters, remove it
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      }
      // Otherwise, add it
      return [...prev, tag];
    });
  };

  // Remove a specific filter tag
  const removeFilter = (tagToRemove) => {
    setActiveFilters(activeFilters.filter(tag => tag !== tagToRemove));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchQuery("");
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + loadIncrement);
  };

  const visibleListings = filteredListings.slice(0, visibleCount);

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

  if (allListings.length === 0) {
    return (
      <div className="marketplace-container">
        <p>No listings found in the database.</p>
      </div>
    );
  }

  return (
    <div className="marketplace-container">
      <FilterSection
        onSearch={handleSearch}
        onTagSelect={handleTagSelect}
        currentSearchQuery={searchQuery}
        activeFilters={activeFilters}
      />
      <div className="product-listings-wrapper">
        {(activeFilters.length > 0 || searchQuery) && (
          <div className="active-filters">
            {searchQuery && (
              <div className="active-search">
                <span>Search: {searchQuery}</span>
                <button onClick={() => setSearchQuery("")}>✕</button>
              </div>
            )}

            {activeFilters.map(filter => (
              <div key={filter} className="active-tag">
                <span>Tag: {filter}</span>
                <button onClick={() => removeFilter(filter)}>✕</button>
              </div>
            ))}

            {(activeFilters.length > 0 || searchQuery) && (
              <button className="clear-all-btn" onClick={clearAllFilters}>
                Clear All
              </button>
            )}
          </div>
        )}

        {filteredListings.length === 0 ? (
          <div className="no-results">
            <p>No listings match your search criteria.</p>
            {(activeFilters.length > 0 || searchQuery) && (
              <button onClick={clearAllFilters}>Clear All Filters</button>
            )}
          </div>
        ) : (
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
        )}
        {visibleCount < filteredListings.length && (
          <div className="load-more-container">
            <button onClick={handleLoadMore}>Load More</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;