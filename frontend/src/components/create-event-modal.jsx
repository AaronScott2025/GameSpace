import React, { useState, useEffect, useRef } from "react";
import { IoMdAdd } from "react-icons/io";
import { FaTimes } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import { createPortal } from "react-dom";
import PlaceAutocompleteComponent from "./PlaceAutocompleteComponent";

import "../styles/create-event-modal.css";

const AVAILABLE_TAGS = [
  "Gaming",
  "Tournament",
  "Casual",
  "Competitive",
  "Board Games",
  "Card Games",
  "RPG",
  "Strategy",
  "Sports",
  "Social",
];

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
];

function CreateEventModal({ onSubmit }) {
  // Add this inside the CreateEventModal component
  const autocompleteInputRef = useRef(null);

  useEffect(() => {
    if (!autocompleteInputRef.current) return;

    // Initialize the Place Autocomplete Element
    const autocomplete = new google.maps.places.Autocomplete(
      autocompleteInputRef.current,
      {
        fields: ["address_components", "geometry"],
        types: ["address"],
        componentRestrictions: { country: "us" },
      }
    );

    // Handle the place selection
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.address_components) return;

      const getComponent = (type) =>
        place.address_components.find((c) => c.types.includes(type))
          ?.long_name || "";

      const streetNumber = getComponent("street_number");
      const route = getComponent("route");
      const city = getComponent("locality") || getComponent("sublocality");
      const state = getComponent("administrative_area_level_1");

      const fullStreet = `${streetNumber} ${route}`.trim();
      document.querySelector("input[name='street_address']").value = fullStreet;
      document.querySelector("input[name='location_city']").value = city;
      setSelectedState(state);
    });

    return () => {
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, []);

  const eventFormInputs = [
    { label: "Event Name", type: "text", name: "title", required: true },
    { label: "Date", type: "date", name: "date", required: true },
    {
      label: "Street Address",
      type: "text",
      name: "street_address",
      required: true,
    },
    { label: "City", type: "text", name: "location_city", required: true },
  ];

  const [selectedEventType, setSelectedEventType] = useState("in-person");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedAmPm, setSelectedAmPm] = useState("PM");
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleEventSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      // Ensure at least one tag is selected
      if (selectedTags.length === 0) {
        throw new Error("You must select at least one tag.");
      }
      let formattedHour = parseInt(selectedHour);
      if (selectedAmPm === "PM" && formattedHour !== 12) {
        formattedHour += 12;
      } else if (selectedAmPm === "AM" && formattedHour === 12) {
        formattedHour = 0;
      }

      const eventDate = formData.date;
      const timeStr = `${formattedHour
        .toString()
        .padStart(2, "0")}:${selectedMinute}:00`;

      const event_time = `${eventDate}T${timeStr}`;

      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location_city: formData.location_city,
        location_state: selectedState,
        location_country: "USA", // Default to USA
        is_online: selectedEventType === "online",
        street_address: formData.street_address,
        event_time: event_time,
        tags: selectedTags,
      };

      if (onSubmit) {
        onSubmit(eventData);
      }

      handleCloseModal();
    } catch (err) {
      console.error("Error creating event:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const TagSelector = () => {
    const toggleTag = (tag) => {
      if (selectedTags.includes(tag)) {
        // Remove the tag if it's already selected
        setSelectedTags(selectedTags.filter((t) => t !== tag));
      } else if (selectedTags.length < 4) {
        // Add the tag only if the limit of 4 tags is not reached
        setSelectedTags([...selectedTags, tag]);
      } else {
        alert("You can only select up to 4 tags."); // Optional: Notify the user
      }
    };

    return (
      <div className="tag-selector-container">
        <div className="tag-selector-label" label="required">
          Select Tags (1 required, up to 4)
        </div>
        <div className="tags-container">
          {AVAILABLE_TAGS.map((tag) => (
            <div
              key={tag}
              className={`tag-item ${
                selectedTags.includes(tag) ? "selected" : ""
              }`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
              {selectedTags.includes(tag) && (
                <span className="remove-tag">
                  <FaTimes size={10} />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const EventTypeSelector = () => {
    return (
      <div className="event-type-selector">
        <div className="event-type-label">Event Type</div>
        <div className="event-type-options">
          <label className="event-type-option">
            <input
              type="radio"
              name="event-type"
              value="in-person"
              checked={selectedEventType === "in-person"}
              onChange={() => setSelectedEventType("in-person")}
            />
            <span>In-Person</span>
          </label>
          <label className="event-type-option">
            <input
              type="radio"
              name="event-type"
              value="online"
              checked={selectedEventType === "online"}
              onChange={() => setSelectedEventType("online")}
            />
            <span>Online</span>
          </label>
        </div>
      </div>
    );
  };

  const StateSelector = () => {
    return (
      <label className="state-selector">
        State
        <select
          name="location_state"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          required
          className="state-dropdown"
        >
          <option value="" disabled>
            Select a state
          </option>
          {US_STATES.map((state) => (
            <option key={state.value} value={state.value}>
              {state.label}
            </option>
          ))}
        </select>
      </label>
    );
  };

  const TimePicker = () => {
    const hours = Array.from({ length: 12 }, (_, i) =>
      (i + 1).toString().padStart(2, "0")
    );
    const minutes = Array.from({ length: 12 }, (_, i) =>
      (i * 5).toString().padStart(2, "0")
    );

    const toggleTimePicker = () => {
      setShowTimePicker(!showTimePicker);
    };

    const handleClickOutside = (e) => {
      if (
        e.target.closest(".time-picker-dropdown") === null &&
        e.target.closest(".time-input-container") === null
      ) {
        setShowTimePicker(false);
      }
    };

    useEffect(() => {
      if (showTimePicker) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [showTimePicker]);

    return (
      <label className="time-input-label">
        Time
        <div className="time-input-container">
          <div className="time-input-display" onClick={toggleTimePicker}>
            <span>
              {selectedHour}:{selectedMinute} {selectedAmPm}
            </span>
            <IoTimeOutline size={18} className="time-icon" />
          </div>

          {showTimePicker && (
            <div className="time-picker-dropdown">
              <div className="time-picker-columns">
                <div className="time-picker-column">
                  <div className="time-picker-column-header">Hour</div>
                  <div className="time-picker-options">
                    {hours.map((hour) => (
                      <div
                        key={hour}
                        className={`time-picker-option ${
                          selectedHour === hour ? "selected" : ""
                        }`}
                        onClick={() => setSelectedHour(hour)}
                      >
                        {hour}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="time-picker-column">
                  <div className="time-picker-column-header">Minute</div>
                  <div className="time-picker-options">
                    {minutes.map((minute) => (
                      <div
                        key={minute}
                        className={`time-picker-option ${
                          selectedMinute === minute ? "selected" : ""
                        }`}
                        onClick={() => setSelectedMinute(minute)}
                      >
                        {minute}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="time-picker-column am-pm-column">
                  <div className="time-picker-column-header">AM/PM</div>
                  <div className="time-picker-options">
                    <div
                      className={`time-picker-option ${
                        selectedAmPm === "AM" ? "selected" : ""
                      }`}
                      onClick={() => setSelectedAmPm("AM")}
                    >
                      AM
                    </div>
                    <div
                      className={`time-picker-option ${
                        selectedAmPm === "PM" ? "selected" : ""
                      }`}
                      onClick={() => setSelectedAmPm("PM")}
                    >
                      PM
                    </div>
                  </div>
                </div>
              </div>

              <div className="time-picker-actions">
                <button
                  type="button"
                  className="time-picker-done-btn"
                  onClick={() => setShowTimePicker(false)}
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Hidden input to store the time value for form submission */}
          <input
            type="hidden"
            name="time"
            value={`${selectedHour}:${selectedMinute} ${selectedAmPm}`}
          />
        </div>
      </label>
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTags([]);
    setSelectedEventType("in-person");
    setSelectedState("");
    setSelectedHour("12");
    setSelectedMinute("00");
    setSelectedAmPm("PM");
    setShowTimePicker(false);
    setError(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        handleCloseModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const modalContent =
    isModalOpen &&
    createPortal(
      <div className="event-modal-overlay">
        <div className="event-modal-container">
          <button className="event-modal-close" onClick={handleCloseModal}>
            &times;
          </button>
          <h2 className="event-modal-title">Create New Event</h2>
          <div className="event-modal-content">
            {error && <div className="error-message">Error: {error}</div>}
            <form
              className="event-modal-form"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData.entries());
                handleEventSubmit(data);
              }}
            >
              <PlaceAutocompleteComponent />
              {eventFormInputs.map((input, index) => (
                <label key={index}>
                  {input.label}
                  <input
                    type={input.type || "text"}
                    name={input.name}
                    required={input.required || false}
                    placeholder={`Enter ${input.label.toLowerCase()}`}
                  />
                </label>
              ))}

              <TimePicker />
              <StateSelector />

              <div className="description-container">
                <label>
                  Description
                  <textarea
                    name="description"
                    required={true}
                    style={{ height: "100px", resize: "vertical" }}
                    placeholder="Enter description"
                  />
                </label>
              </div>

              <div className="selection-container">
                <EventTypeSelector />
                <TagSelector />
              </div>

              <div className="event-modal-buttons">
                <button
                  type="button"
                  className="event-modal-cancel"
                  onClick={handleCloseModal}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="event-modal-submit"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <button
        className="create-event-button"
        onClick={() => setIsModalOpen(true)}
      >
        <IoMdAdd size={24} />
        Create Event
      </button>

      {modalContent}
    </>
  );
}

export default CreateEventModal;
