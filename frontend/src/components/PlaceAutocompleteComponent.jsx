import React, { useState, useRef } from "react";
import "../styles/create-event-modal.css";

function PlaceAutocompleteComponent({ className }) {
  const [inputValue, setInputValue] = useState(""); // State for the input value
  const [predictions, setPredictions] = useState([]); // State for autocomplete predictions
  const autocompleteService = useRef(null); // Ref for the AutocompleteService

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (!autocompleteService.current) {
      // Initialize the AutocompleteService
      autocompleteService.current =
        new google.maps.places.AutocompleteService();
    }

    if (value.trim() === "") {
      setPredictions([]);
      return;
    }

    // Fetch autocomplete predictions
    autocompleteService.current.getPlacePredictions(
      {
        input: value,
        types: ["address"],
        componentRestrictions: { country: "us" },
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setPredictions(results || []);
        } else {
          setPredictions([]);
        }
      }
    );
  };

  const handlePredictionClick = (prediction) => {
    setInputValue(prediction.description); // Set the input value to the selected prediction
    setPredictions([]); // Clear the predictions dropdown
  };

  return (
    <div className="custom-autocomplete">
      {/* Label for the input field */}
      <label className="form-label">Search Address</label>

      {/* Custom input field */}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className={`place-autocomplete ${className}`}
        placeholder="Start typing address..."
      />

      {/* Dropdown for autocomplete predictions */}
      {predictions.length > 0 && (
        <ul className="autocomplete-dropdown">
          {predictions.map((prediction) => (
            <li
              key={prediction.place_id}
              className="autocomplete-item"
              onClick={() => handlePredictionClick(prediction)}
            >
              {prediction.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PlaceAutocompleteComponent;
