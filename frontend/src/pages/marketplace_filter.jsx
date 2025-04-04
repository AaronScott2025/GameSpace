import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/marketplace_filter.css";
import { supabase } from "../../client.js";
import ButtonModal from "../components/button-modal.jsx";
import { UserContext } from "./UserContext.jsx";
import { IoMdAdd } from "react-icons/io";

const CollapsibleSection = ({ title, items }) => {
  const [open, setOpen] = useState(false);
  const toggleSection = () => setOpen(!open);

  return (
    <div className="collapsible-section">
      <div className="section-header" onClick={toggleSection}>
        <h3>{title}</h3>
        <span className="toggle-icon">{open ? "-" : "+"}</span>
      </div>
      {open && (
        <ul className="section-list">
          {items.map((item, index) => (
            <li key={index}>
              <label>
                <input type="checkbox" name={item} />
                {item}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const FilterSection = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleMarketplaceClick = () => {
    navigate("/marketplace");
  };

  const handleCreateListing = async (data) => {
    const { title, description, location, price, condition, picture } = data;
    let pictureUrl = null;
    if (picture) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("marketplace-images")
        .upload(`public/${Date.now()}_${picture.name}`, picture);
      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return;
      }
      const { data: publicURLData, error: urlError } = supabase.storage
        .from("marketplace-images")
        .getPublicUrl(uploadData.path);
      if (urlError) {
        console.error("Error getting public URL:", urlError);
        return;
      }
      pictureUrl = publicURLData.publicUrl;
    }
    const { error } = await supabase
      .from("listings")
      .insert([
        {
          username: user.username,
          title,
          picture: pictureUrl,
          listing_description: description,
          location,
          listing_price: price,
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

  const filterSections = [
    {
      title: "Games",
      items: ["Action", "Adventure", "Role-Playing", "Strategy", "Sports"],
    },
    {
      title: "Gaming Accessories",
      items: ["Headset", "Keyboard", "Mouse", "Controller", "Monitor"],
    },
    {
      title: "Gaming Consoles",
      items: ["PlayStation", "Xbox", "Nintendo Switch", "PC", "Others"],
    },
    {
      title: "Collectibles",
      items: ["Figures", "Posters", "Stickers", "Art Books", "Limited Editions"],
    },
    {
      title: "Advanced Filter",
      items: ["Price Range", "Release Date", "User Ratings", "Availability"],
    },
  ];

  return (
    <aside className="filter-section">
      <h2
        className="filter-title"
        onClick={handleMarketplaceClick}
        style={{ cursor: "pointer" }}
      >
        Marketplace
      </h2>
      <div className="search-bar">
        <input type="text" placeholder="Search" />
      </div>
      <ButtonModal
        buttonText="Create Listing"
        className="create-listing-button"
        icon={IoMdAdd}
        iconSize={24}
        title="Create New Listing"
        inputs={[
          { label: "Title", type: "text", name: "title" },
          { label: "Description", type: "textarea", name: "description" },
          { label: "Location", type: "text", name: "location" },
          { label: "Price", type: "number", name: "price" },
          { label: "Condition", type: "text", name: "condition" },
          { label: "Picture", type: "file", name: "picture" },
        ]}
        onSubmit={handleCreateListing}
        id="create-listing-button"
        araia-label="Create Listing"
        formClassName={"listing-form"}
        modalClassName={"listing-modal"}
        submitButtonClassName={"submit-listing-button"}
        closeButtonClassName={"close-listing-button"}
        buttonsClassName={"listing-buttons"}
      />
      <div className="filter-group">
        {filterSections.map((section, index) => (
          <CollapsibleSection
            key={index}
            title={section.title}
            items={section.items}
          />
        ))}
      </div>
    </aside>
  );
};

export default FilterSection;
