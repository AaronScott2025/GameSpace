import React, { useState, useEffect, useCallback, useContext } from "react";
import { UserContext } from "./UserContext.jsx";
import "../styles/events-page.css"; // Import your CSS file for styling
import { supabase } from "../../client.js"; // Shared client
import ButtonModal from "../components/button-modal";
import { IoMdAdd } from "react-icons/io";
import EventsCard from "../components/event-card.jsx";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
  Pin,
} from "@vis.gl/react-google-maps";
import { FaLocationDot } from "react-icons/fa6";
import {
  useGeolocation,
  useReverseGeocoding,
  useEventsToGeo,
} from "../hooks/geolocation.jsx";
import {
  useEventsTable,
  useEventswithTags,
} from "../hooks/events-supabase.jsx";
import axios from "axios";
import CreateEventModal from "../components/create-event-modal.jsx"; // Import your modal component
import { color } from "framer-motion";
import { GiAstronautHelmet } from "react-icons/gi";

function EventsPage() {
  const { position, error, geoError } = useGeolocation();
  const { location, error: reverseGeoError } = useReverseGeocoding(position);
  const { data: events, error: tableWithTagsError } = useEventswithTags();
  const { geolocations, error: evntGeoError } = useEventsToGeo();
  const [selectedFilter, setSelectedFilter] = useState("all-events"); // Default filter
  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [userPositionInfoWindow, setUserPositionInfoWindow] = useState(false); // State to manage the info window for the user's position
  const [myPostionRef, myPosition] = useAdvancedMarkerRef(); // Ref for the user's position marker
  const { user } = useContext(UserContext); // Get the user context
  const userImage = user?.profile_pic || null;

  const HandleYourPosition = useCallback(
    () => setUserPositionInfoWindow((isShow) => !isShow),
    []
  ); // Placeholder for your position handling

  // if the maps api closes the infowindow, we have to synchronize our state
  const handleClose = useCallback(() => setUserPositionInfoWindow(false), []);

  const handleFilterChange = (filterName) => {
    setSelectedFilter(filterName); // Update the selected filter
  };
  useEffect(() => {
    // Ensure the info window is closed on initial load or map reload
    setUserPositionInfoWindow(false);
  }, [position]); // Dependency ensures it runs when the position changes

  // Error handling logic
  const renderErrors = () => {
    const errors = [];
    if (geoError) errors.push(`Geolocation Error: ${geoError.message}`);
    if (reverseGeoError)
      errors.push(`Reverse Geocoding Error: ${reverseGeoError.message}`);
    if (tableWithTagsError)
      errors.push(`Events with Tags Error: ${tableWithTagsError.message}`);
    if (evntGeoError)
      errors.push(`Event Geolocations Error: ${evntGeoError.message}`);
    return errors.length > 0 ? (
      <div className="error-messages">
        {errors.map((err, index) => (
          <p key={index} className="error-text">
            {err}
          </p>
        ))}
      </div>
    ) : null;
  };
  if (!position) {
    return <div>Loading map...</div>; // Show a loading state until position is available
  }

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}>
      <div className="events-page">
        {renderErrors()} {/* Display errors at the top of the page */}
        <aside className="events-sidebar">
          <h2 className="events-title">Events</h2>
          <div className="search-bar">
            <input type="text" placeholder="Search" />
          </div>
          {/**
           * ButtonModal will change to handle tags
           * TODO:
           * MAKE THE MODAL WORK LOL
           * style the modal with the form
           * allow the user to select multiple tags
           * maybe allow the user to create new tags
           *
           * OR
           *
           * create a new modal, pop up or page to create a new event up to whoever is developing this
           *  */}
          <CreateEventModal />
          <div className="events-filter">
            {/**
             * TODO:
             * Make the filters work
             * allow user to use one filter at a time
             * make the default filter "All Events"
             */}
            <input
              className="events-filter-checkbox"
              type="checkbox"
              name="all-events"
              id="all-events"
              checked={selectedFilter === "all-events"}
              onChange={() => handleFilterChange("all-events")}
            />
            <span>All Events</span>
            <input
              className="events-filter-checkbox"
              type="checkbox"
              name="online"
              id="online"
              checked={selectedFilter === "online"}
              onChange={() => handleFilterChange("online")}
            />
            <span>Online</span>
            <input
              className="events-filter-checkbox"
              type="checkbox"
              name="in-person"
              id="in-person"
              checked={selectedFilter === "in-person"}
              onChange={() => handleFilterChange("in-person")}
            />
            <span>In-Person</span>
          </div>
          <div className="events-cards-container">
            {/**
             * TODO:
             * allow scrolling to load more events, without allowing the cards to overflow out of the container( Lazy Loading)
             * the cards should be displayed in order of most close to the user
             * when clicking on a card, it should make the map center and zoom in on the event
             *
             */}
            {events.map((event) => (
              <EventsCard
                is_Online={event.is_online} //remember this is a boolean
                key={`${event.event_id}-card`}
                eventName={event.title}
                date={event.date}
                location={`${event.street_address}, ${event.location_city}, ${event.location_state}`}
                tags={event.tag_names}
              />
            ))}
          </div>
        </aside>
        <main>
          <header className="map-header">
            <FaLocationDot color="red" />
            <span>
              {`${location.city}, ${location.state}` || "fetching address.."}
            </span>
          </header>

          <div className="map-container">
            {position && (
              <Map
                style={{
                  width: "70vw",
                  height: "75vh",
                  position: "relative",
                  zIndex: 0, // Ensure the map stays behind the modal. this didn't work
                }}
                defaultCenter={position}
                defaultZoom={9}
                gestureHandling={"greedy"}
                disableDefaultUI={true}
                mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
              >
                <AdvancedMarker
                  id="Your-Location"
                  position={position}
                  ref={myPostionRef}
                  onClick={HandleYourPosition}
                >
                  <div
                    className="custom-pin"
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#4285F4",
                      borderRadius: "50%",
                      borderColor: "#4285F4",
                      borderWidth: "5px",
                      borderStyle: "solid",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                      border: "2px solid #000",
                    }}
                  >
                    <img
                      src={userImage || GiAstronautHelmet} // Use the user's profile picture or a default image
                      alt="User Icon"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </AdvancedMarker>

                {myPosition && userPositionInfoWindow && (
                  <InfoWindow
                    anchor={myPosition} // Pass a valid marker or AdvancedMarkerElement
                    onClose={() => setUserPositionInfoWindow(false)} // Handle close event
                  >
                    <span style={{ color: "black" }}>
                      {`${location.city}, ${location.state}` ||
                        "fetching address.."}
                    </span>
                  </InfoWindow>
                )}
                {/**
                 * style the markers to be more visible
                 * TODO:
                 * add a popup to the markers that shows the event name and date
                 * limit the number of markers and calls to the api.
                 */}
                {geolocations.map((event) =>
                  event.lat && event.lng ? (
                    <AdvancedMarker
                      id={event.event_id}
                      key={`${event.event_id}-marker`}
                      position={{ lat: event.lat, lng: event.lng }}
                    />
                  ) : null
                )}
              </Map>
            )}
          </div>
        </main>
      </div>
    </APIProvider>
  );
}
export default EventsPage;
