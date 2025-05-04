import React, { useEffect, useRef, useState } from "react";
import "../styles/create-event-modal.css";
function PlaceAutocompleteComponent({ className, classNamePlace }) {
  const autocompleteRef = useRef(null); // Ref for the PlaceAutocompleteElement container
  const [selectedPlace, setSelectedPlace] = useState(null); // State to store the selected place

  useEffect(() => {
    let placeAutocomplete;

    async function initializeAutocomplete() {
      // Request the "places" library
      await google.maps.importLibrary("places");

      // Create the PlaceAutocompleteElement
      placeAutocomplete = new google.maps.places.PlaceAutocompleteElement();

      // Append the PlaceAutocompleteElement to the container
      if (autocompleteRef.current) {
        autocompleteRef.current.appendChild(placeAutocomplete);
      }

      // Add the "gmp-select" event listener
      placeAutocomplete.addEventListener(
        "gmp-select",
        async ({ placePrediction }) => {
          const place = placePrediction.toPlace();
          await place.fetchFields({
            fields: ["displayName", "formattedAddress", "location"],
          });

          // Update the selected place state
          setSelectedPlace(place.toJSON());
        }
      );
    }

    initializeAutocomplete();

    // Cleanup function to remove the PlaceAutocompleteElement
    return () => {
      if (placeAutocomplete) {
        placeAutocomplete.remove();
      }
    };
  }, []);

  return (
    <div>
      {/* Label for the PlaceAutocompleteElement */}
      <label className="form-label">Search Address</label>

      {/* Container for the PlaceAutocompleteElement */}
      <div ref={autocompleteRef} className="place-autocomplete"></div>

      {/* Display the selected place information */}
      {selectedPlace && (
        <div>
          <h3>Selected Place:</h3>
          <pre>{JSON.stringify(selectedPlace, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default PlaceAutocompleteComponent;
