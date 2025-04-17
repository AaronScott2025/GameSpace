import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from "react";
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
  useMap,
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
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredeEvents, setFilteredEvents] = useState([]); // Filtered posts
  const [SelectedEventId, setSelectedEventId] = useState(null); // State to manage selected event ID
  const [mapInstance, setMapInstance] = useState(null); // State to manage the map instance

  const handleCardSelect = (eventId) => {
    setSelectedEventId((prevSelectedId) => {
      const newSelectedId = prevSelectedId === eventId ? null : eventId;

      const updatedEvents = filteredeEvents.map((event) => ({
        ...event,
        isSelected: event.event_id === newSelectedId,
      }));

      setFilteredEvents(updatedEvents);

      return newSelectedId; // ✅ Let <MapController /> handle map movement
    });
  };

  useEffect(() => {
    if (events && events.length > 0) {
      setFilteredEvents(events); // Initially show all events
    }
  }, [events]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = events.filter((event) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          event.title.toLowerCase().includes(searchLower) || // Search by title
          event.street_address.toLowerCase().includes(searchLower) || // Search by street address
          event.location_city.toLowerCase().includes(searchLower) || // Search by city
          event.location_state.toLowerCase().includes(searchLower) // Search by state
        );
      });
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events); // Reset to all events if search query is empty
    }
  }, [searchQuery, events]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update the search query
  };

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
    if (selectedFilter === "all-events") {
      setFilteredEvents(events); // Show all events
    } else if (selectedFilter === "online") {
      const filtered = events.filter((event) => event.is_online === true); // Filter online events
      setFilteredEvents(filtered);
    } else if (selectedFilter === "in-person") {
      const filtered = events.filter((event) => event.is_online === false); // Filter in-person events
      setFilteredEvents(filtered);
    }
  }, [selectedFilter, events]);

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

  const markerRefs = useRef({});

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
            <input
              type="text"
              placeholder="Search by title, address, city, or state"
              value={searchQuery}
              onChange={handleSearchChange}
            />
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
          <div className="events-cards-wrapper">
            <div className="events-cards-container">
              {/**
               * TODO:
               * allow scrolling to load more events, without allowing the cards to overflow out of the container( Lazy Loading)
               * the cards should be displayed in order of most close to the user
               * when clicking on a card, it should make the map center and zoom in on the event
               *
               */}

              {filteredeEvents.length > 0 ? (
                filteredeEvents.map((event) => (
                  <EventsCard
                    is_Online={event.is_online} // remember this is a boolean
                    key={`${event.event_id}-card`}
                    eventName={event.title}
                    date={event.date}
                    location={`${event.street_address}, ${event.location_city}, ${event.location_state}`}
                    tags={event.tag_names}
                    onSelect={() => handleCardSelect(event.event_id)} // Handle card selection
                    isSelected={SelectedEventId === event.event_id} // Highlight selected card
                  />
                ))
              ) : (
                <p>No results found</p>
              )}
            </div>
            {/**end of events container */}
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
                onLoad={(map) => setMapInstance(map)} // Store the map instance
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
                <MapController
                  selectedEventId={SelectedEventId}
                  geolocations={geolocations}
                  userPosition={position}
                ></MapController>
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
                      border: "2px solid #000 !important",
                      borderColor: "#4285F4",
                      borderWidth: "3px",
                      borderStyle: "solid",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={userImage} // Use the user's profile picture or a default image
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
                {geolocations.map((event) => {
                  if (!event.lat || !event.lng) return null;

                  return (
                    <AdvancedMarker
                      key={`${event.event_id}-marker`}
                      position={{ lat: event.lat, lng: event.lng }}
                      ref={(marker) => {
                        if (marker) markerRefs.current[event.event_id] = marker;
                      }}
                    />
                  );
                })}
              </Map>
            )}
          </div>
        </main>
      </div>
    </APIProvider>
  );
}

export default EventsPage;

function MapController({ selectedEventId, geolocations, userPosition }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const zoomTo = (location, zoomLevel = 14) => {
      map.panTo(location);
      smoothZoom(map, zoomLevel);
    };

    if (!selectedEventId && userPosition?.lat && userPosition?.lng) {
      zoomTo(userPosition, 9); // zoom out to user's location
      return;
    }

    const targetEvent = geolocations.find(
      (e) => e.event_id === selectedEventId
    );

    if (targetEvent?.lat && targetEvent?.lng) {
      zoomTo({ lat: targetEvent.lat, lng: targetEvent.lng }, 14);
    }
  }, [selectedEventId, geolocations, userPosition, map]);

  return null;
}

function smoothZoom(map, targetZoom, delay = 100) {
  const currentZoom = map.getZoom();
  if (currentZoom === targetZoom) return;

  const step = targetZoom > currentZoom ? 1 : -1;

  const zoomTimer = setInterval(() => {
    const newZoom = map.getZoom() + step;
    map.setZoom(newZoom);

    if (newZoom === targetZoom) {
      clearInterval(zoomTimer);
    }
  }, delay);
}
