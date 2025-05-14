import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/marketplace_filter.css";
import { supabase } from "../../client.js";
import { UserContext } from "./UserContext.jsx";
import { IoMdAdd } from "react-icons/io";

const FILTER_CATEGORIES = {
  Games: [
    "Action",
    "Adventure",
    "Role-Playing",
    "Strategy",
    "Sports",
    "Simulation",
    "Puzzle",
    "Horror",
    "Racing",
    "Platform",
  ],
  "Gaming Accessories": [
    "Headset",
    "Keyboard",
    "Mouse",
    "Controller",
    "Monitor",
    "Speakers",
    "VR",
    "Chair",
    "Gaming Desk",
    "Mousepad",
  ],
  "Gaming Consoles": [
    "PlayStation",
    "Xbox",
    "Nintendo Switch",
    "PC",
    "Retro",
    "Steam Deck",
    "Handheld",
    "Mobile",
  ],
  Collectibles: [
    "Figures",
    "Posters",
    "Cards",
    "Stickers",
    "Art Books",
    "Limited Editions",
    "Merchandise",
    "Funko Pop",
    "Statues",
  ],
};

const CONDITION_OPTIONS = [
  "New",
  "Like New",
  "Good",
  "Used",
  "Refurbished",
  "For Parts",
];

const ALL_PREDEFINED_TAGS = Object.values(FILTER_CATEGORIES).flat();

const getPopularTags = () => {
  return [
    "PlayStation",
    "Action",
    "Controller",
    "PC",
    "Nintendo Switch",
    "Headset",
    "Limited Editions",
    "Adventure",
    "Xbox",
  ];
};

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
          {items.map((item) => (
            <li key={item}>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  name={item}
                  checked={selectedTags.includes(item)}
                  onChange={() => onItemClick(item)}
                />
                <span className="filter-label">{item}</span>
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
          {popularTags.map((tag) => (
            <span
              key={tag}
              className={`filter-tag ${
                selectedTags.includes(tag) ? "selected" : ""
              }`}
              onClick={() => onTagClick(tag)}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterSection = ({
  onTagSelect,
  onSearch,
  currentSearchQuery = "",
  activeFilters = [],
}) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [searchInput, setSearchInput] = useState(currentSearchQuery || "");
  const [selectedTags, setSelectedTags] = useState(activeFilters || []);
  const [popularTags, setPopularTags] = useState(getPopularTags());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listingFormData, setListingFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    condition: "New",
    picture: null,
  });
  const [selectedModalTags, setSelectedModalTags] = useState([]);
  const [tagSearchInput, setTagSearchInput] = useState("");
  const [activeTagCategory, setActiveTagCategory] = useState("Popular");
  const [filteredTags, setFilteredTags] = useState([]);

  useEffect(() => {
    // Only update selectedTags if activeFilters has changed
    if (JSON.stringify(selectedTags) !== JSON.stringify(activeFilters)) {
      setSelectedTags(activeFilters);
    }
  }, [activeFilters, selectedTags]);

  useEffect(() => {
    setSearchInput(currentSearchQuery || "");
  }, [currentSearchQuery]);

  const handleMarketplaceClick = () => {
    navigate("/marketplace");
  };

  const handleSearchInputChange = (e) => {
    const newSearchValue = e.target.value;
    setSearchInput(newSearchValue);
    if (onSearch) {
      onSearch(newSearchValue);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(searchInput);
    }
  };

  const handleTagClick = (tag) => {
    if (onTagSelect) {
      onTagSelect(tag);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setListingFormData({
      title: "",
      description: "",
      location: "",
      price: "",
      condition: "New",
      picture: null,
    });
    setSelectedModalTags([]);
    setTagSearchInput("");
    setActiveTagCategory("Popular");
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setListingFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setListingFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    if (tagSearchInput.trim()) {
      setFilteredTags(
        ALL_PREDEFINED_TAGS.filter((tag) =>
          tag.toLowerCase().includes(tagSearchInput.toLowerCase())
        )
      );
    } else if (activeTagCategory === "Popular") {
      setFilteredTags(popularTags);
    } else {
      setFilteredTags(FILTER_CATEGORIES[activeTagCategory] || []);
    }
  }, [tagSearchInput, activeTagCategory, popularTags]);

  const handleTagSearch = (e) => {
    setTagSearchInput(e.target.value);
  };

  const toggleModalTag = (tag) => {
    setSelectedModalTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      return [...prev, tag];
    });
  };

  const handleCategoryChange = (category) => {
    setActiveTagCategory(category);
    setTagSearchInput("");
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();

    if (
      !listingFormData.title ||
      !listingFormData.description ||
      !listingFormData.location ||
      !listingFormData.price
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (selectedModalTags.length === 0) {
      alert("Please select at least one tag");
      return;
    }

    try {
      let pictureUrl = null;
      if (listingFormData.picture) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("marketplace-images")
          .upload(
            `public/${Date.now()}_${listingFormData.picture.name}`,
            listingFormData.picture
          );

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          throw uploadError;
        }

        const { data: publicURLData, error: urlError } = supabase.storage
          .from("marketplace-images")
          .getPublicUrl(uploadData.path);

        if (urlError) {
          console.error("Error getting public URL:", urlError);
          throw urlError;
        }

        pictureUrl = publicURLData.publicUrl;
      }

      const { error } = await supabase.from("listings").insert([
        {
          username: user.username,
          title: listingFormData.title,
          picture: pictureUrl,
          listing_description: listingFormData.description,
          location: listingFormData.location,
          listing_price: parseFloat(listingFormData.price),
          condition: listingFormData.condition,
          tags: selectedModalTags,
        },
      ]);

      if (error) {
        console.error("Error creating listing:", error);
        throw error;
      }

      alert("Listing created successfully!");
      closeModal();
      window.location.reload();
    } catch (error) {
      alert(`Error creating listing: ${error.message}`);
    }
  };

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

      <button
        className="create-listing-button"
        onClick={openModal}
        aria-label="Create Listing"
      >
        <IoMdAdd size={24} />
        Create Listing
      </button>

      {isModalOpen && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target.className === "modal-overlay") {
              closeModal();
            }
          }}
        >
          <div className="listing-modal">
            <div className="listing-modal-header">
              <h2>Create New Listing</h2>
            </div>

            <form className="listing-form" onSubmit={handleCreateListing}>
              <div className="form-layout">
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={listingFormData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={listingFormData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="location">Location</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={listingFormData.location}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="price">Price ($)</label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        min="0"
                        step="0.01"
                        value={listingFormData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="condition">Condition</label>
                      <select
                        id="condition"
                        name="condition"
                        value={listingFormData.condition}
                        onChange={handleInputChange}
                        required
                      >
                        {CONDITION_OPTIONS.map((cond) => (
                          <option key={cond} value={cond}>
                            {cond}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="picture">Picture</label>
                      <input
                        type="file"
                        id="picture"
                        name="picture"
                        accept="image/*"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-column tag-column">
                  <div className="form-group tag-selector-container">
                    <label>
                      Tags <span className="required-indicator">*</span>
                    </label>

                    <div className="tag-search">
                      <input
                        type="text"
                        placeholder="Search for tags..."
                        value={tagSearchInput}
                        onChange={handleTagSearch}
                      />
                    </div>

                    <div className="tag-categories-tabs">
                      <button
                        type="button"
                        className={`category-tab ${
                          activeTagCategory === "Popular" ? "active" : ""
                        }`}
                        onClick={() => handleCategoryChange("Popular")}
                      >
                        Popular
                      </button>
                      {Object.keys(FILTER_CATEGORIES).map((category) => (
                        <button
                          key={category}
                          type="button"
                          className={`category-tab ${
                            activeTagCategory === category ? "active" : ""
                          }`}
                          onClick={() => handleCategoryChange(category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>

                    <div className="selected-tags-container">
                      {selectedModalTags.length > 0 ? (
                        <div className="selected-tags-list">
                          {selectedModalTags.map((tag) => (
                            <div key={tag} className="selected-tag">
                              <span>{tag}</span>
                              <button
                                type="button"
                                onClick={() => toggleModalTag(tag)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="no-tags-selected">No tags selected</div>
                      )}
                    </div>

                    <div className="available-tags-grid">
                      {filteredTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          className={`tag-option ${
                            selectedModalTags.includes(tag) ? "selected" : ""
                          }`}
                          onClick={() => toggleModalTag(tag)}
                        >
                          {tag}
                        </button>
                      ))}

                      {filteredTags.length === 0 && (
                        <p className="no-tags-found">No matching tags found</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Create Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="filter-group">
        <TagsSection
          popularTags={popularTags}
          onTagClick={handleTagClick}
          selectedTags={selectedTags}
        />

        {Object.entries(FILTER_CATEGORIES).map(([category, tags]) => (
          <CollapsibleSection
            key={category}
            title={category}
            items={tags}
            onItemClick={handleTagClick}
            selectedTags={selectedTags}
          />
        ))}

        <CollapsibleSection
          key="Condition"
          title="Condition"
          items={CONDITION_OPTIONS}
          onItemClick={handleTagClick}
          selectedTags={selectedTags}
        />
      </div>
    </aside>
  );
};

export default FilterSection;
