import React from "react";
import "../styles/marketplace_filter.css";

const FilterSection = () => {
  return (
    <aside className="filter-section">
      <h2 className="filter-title">Marketplace</h2>

      <div className="search-bar">
        <input type="text" placeholder="Search" />
      </div>

      <div className="filter-category">
        <h3>Categories</h3>
        <ul>
          <li>Popular</li>
          <li>Recently Released</li>
          <li>Action</li>
          <li>Adventure</li>
          <li>Role-Playing</li>
          <li>Strategy</li>
        </ul>
      </div>

      <div className="filter-ratings">
        <h3>Ratings</h3>
        <ul>
          <li>Rated E</li>
          <li>Rated T</li>
          <li>Rated M</li>
        </ul>
      </div>
    </aside>
  );
};

export default FilterSection;
