import React from "react";
import "../styles/marketplace_filter.css";
import { supabase } from "../../client.js";
import ButtonModal from "../components/button-modal.jsx";
import { UserContext } from "./UserContext.jsx";

import { IoMdAdd } from "react-icons/io";
import { useContext } from "react";

const FilterSection = () => {
  const { user } = useContext(UserContext); // Get the username from UserContext
  const handleCreateListing = async (data) => {
    const { title, description, location, price, condition } = data;
    const { error } = await supabase
      .from("listings")
      .insert([
        {
          username: user.username, // Use the username from UserContext
          title,
          listing_description: description, // Map to listing_description column
          location,
          listing_price: price, // Map to listing_price column
          condition,
        },
      ])
      .single();

    if (error) {
      console.error("Error creating listing:", error);
    } else {
      console.log("Listing created successfully!");
    }
  };
  return (
    <aside className="filter-section">
      <h2 className="filter-title">Marketplace</h2>

      <div className="search-bar">
        <input type="text" placeholder="Search" />
      </div>

      {/** add the new listing here */}
      <ButtonModal
        buttonText="Create Listing"
        className="create-listing-button"
        icon={IoMdAdd}
        iconSize={24}
        title="Create New Listing"
        inputs={[
          { label: "Title", type: "text", name: "title" },
          { label: "Description", type: "text", name: "description" },
          { label: "Location", type: "text", name: "location" },
          { label: "Price", type: "number", name: "price" },
          { label: "Condition", type: "text", name: "condition" },
        ]}
        onSubmit={handleCreateListing}
        id="create-listing-button"
        araia-label="Create Listing"
      />
      {/**End of buttonModal  */}
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
