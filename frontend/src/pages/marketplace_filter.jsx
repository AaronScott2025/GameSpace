import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/marketplace_filter.css";
import { supabase } from "../../client.js";
import ButtonModal from "../components/button-modal.jsx";
import { UserContext } from "./UserContext.jsx";
import { IoMdAdd } from "react-icons/io";

const CollapsibleSection = ({ title, items, onItemClick, selectedTags }) => {
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
                <input
                  type="checkbox"
                  name={item}
                  checked={selectedTags.includes(item)}
                  onChange={() => onItemClick && onItemClick(item)}
                />
                {item}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const TagsSection = ({ popularTags, onTagClick, selectedTags }) => {
  const [open, setOpen] = useState(true);
  const toggleSection = () => setOpen(!open);

  return (
    <div className="collapsible-section">
      <div className="section-header" onClick={toggleSection}>
        <h3>Popular Tags</h3>
        <span className="toggle-icon">{open ? "-" : "+"}</span>
      </div>
      {open && (
        <div className="tags-list">
          {popularTags.map((tag, index) => (
            <span
              key={index}
              className={`filter-tag ${selectedTags.includes(tag) ? "selected" : ""}`}
              onClick={() => onTagClick && onTagClick(tag)}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterSection = ({ onTagSelect, onSearch, currentSearchQuery = "", activeFilters = [] }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [popularTags, setPopularTags] = useState([]);
  const [searchInput, setSearchInput] = useState(currentSearchQuery || "");
  const [selectedTags, setSelectedTags] = useState(activeFilters);

  const handleMarketplaceClick = () => {
    navigate("/marketplace");
  };

  const handleSearchInputChange = (e) => {
    const newSearchValue = e.target.value;
    setSearchInput(newSearchValue);
    // Apply search in real-time as user types
    if (onSearch) {
      onSearch(newSearchValue);
    }
  };

  // We can keep the handleSearchSubmit for Enter key presses,
  // but it's not strictly necessary since search happens in real-time now
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(searchInput);
    }
  };

  useEffect(() => {
    setSelectedTags(activeFilters);
  }, [activeFilters]);

  useEffect(() => {
    const fetchPopularTags = async () => {
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("tags");
        if (error) {
          console.error("Error fetching tags:", error);
          return;
        }

        if (data && data.length > 0) {
          const allTags = data.flatMap(listing => listing.tags || []);
          const uniqueTags = [...new Set(allTags)];
          setPopularTags(uniqueTags.slice(0, 10));
        } else {
          setPopularTags([]);
        }
      } catch (err) {
        console.error("Error processing tags:", err);
        setPopularTags([]);
      }
    };

    fetchPopularTags();
  }, []);

  useEffect(() => {
    setSearchInput(currentSearchQuery || "");
  }, [currentSearchQuery]);

  const handleTagClick = (tag) => {
    if (onTagSelect) {
      onTagSelect(tag);
    }
  };

  const handleCreateListing = async (data) => {
    const { title, description, location, price, condition, picture, tags } = data;

    let processedTags = [];
    if (tags) {
      processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    }

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
          tags: processedTags
        },
      ])
      .single();

    if (error) {
      console.error("Error creating listing:", error);
    } else {
      console.log("Listing created successfully!");
      window.location.reload();
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
        <input
          type="text"
          placeholder="Search by name or tag"
          value={searchInput}
          onChange={handleSearchInputChange}
          onKeyPress={handleSearchSubmit}
        />
        {searchInput && (
          <button
            className="search-clear-button"
            onClick={() => {
              setSearchInput("");
              onSearch && onSearch("");
            }}
          >
            ✕
          </button>
        )}
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
          { label: "Tags (comma separated)", type: "text", name: "tags", placeholder: "electronics, gaming, used" },
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
        {popularTags.length > 0 && (
          <TagsSection
            popularTags={popularTags}
            onTagClick={handleTagClick}
            selectedTags={selectedTags}
          />
        )}
        {filterSections.map((section, index) => (
          <CollapsibleSection
            key={index}
            title={section.title}
            items={section.items}
            onItemClick={handleTagClick}
            selectedTags={selectedTags}
          />
        ))}
      </div>
    </aside>
  );
};

export default FilterSection;