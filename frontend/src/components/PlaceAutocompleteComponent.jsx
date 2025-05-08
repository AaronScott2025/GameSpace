import React, { useState, useRef, useEffect } from "react";
import "../styles/create-event-modal.css";

function PlaceAutocompleteComponent({ className, onAddressSelect }) {
  const [inputValue, setInputValue] = useState(""); // State for the input value
  const [predictions, setPredictions] = useState([]); // State for autocomplete predictions
  const sessionTokenRef = useRef(null);
  const suggestionLibRef = useRef(null);

  useEffect(() => {
    const loadLibrary = async () => {
      const { AutocompleteSessionToken, AutocompleteService } =
        await google.maps.importLibrary("places");

      sessionTokenRef.current = new AutocompleteSessionToken();
      suggestionLibRef.current = new AutocompleteService();
    };
    loadLibrary();
  }, []);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (
      !value.trim() ||
      !suggestionLibRef.current ||
      !sessionTokenRef.current
    ) {
      setPredictions([]);
      return;
    }

    try {
      // Fetch autocomplete predictions
      suggestionLibRef.current.getPlacePredictions(
        {
          input: value,
          sessionToken: sessionTokenRef.current,
          types: ["geocode"], // Use a valid type like "geocode"
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
    } catch (err) {
      console.error("Autocomplete error:", err);
      setPredictions([]);
    }
  };

  const handlePredictionClick = async (prediction) => {
    setInputValue(prediction.description); // Use the description of the selected prediction
    setPredictions([]);
    if (onAddressSelect) {
      onAddressSelect(prediction); // Pass the full prediction object to the parent
    }
  };
  const handleClear = () => {
    setInputValue(""); // Clear the input value
    setPredictions([]); // Clear the predictions
  };

  return (
    <div className="custom-autocomplete">
      <label className="form-label">Search Address</label>
      <div className="autocomplete-input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className={`place-autocomplete ${className}`}
          placeholder="Start typing address..."
        />
        {inputValue && (
          <button
            type="button"
            className="clear-autocomplete-button"
            onClick={handleClear}
          >
            &times;
          </button>
        )}
      </div>
      {predictions.length > 0 && (
        <ul className="autocomplete-dropdown">
          {predictions.map((prediction, idx) => (
            <li
              key={prediction.place_id || idx}
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
