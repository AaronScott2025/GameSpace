import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
  useMemo,
} from "react";

import { UserContext } from "./UserContext.jsx";
import "../styles/events-page.css"; // Import your CSS file for styling

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
import { useEventswithTags } from "../hooks/events-supabase.jsx";
import { supabase } from "../../client.js";
import CreateEventModal from "../components/create-event-modal.jsx"; // Import your modal component

import { GiAstronautHelmet } from "react-icons/gi"; // TODO: figure out how to use this icon
import GoogleMapsProvider from "../hooks/GoogleMapsProvider.jsx";

function EventsPage() {
  const { position, error, geoError } = useGeolocation();
  const { location, error: reverseGeoError } = useReverseGeocoding(position);
  const { data: events, error: tableWithTagsError } = useEventswithTags();
  const { geolocations, error: evntGeoError } = useEventsToGeo();
  const [selectedFilter, setSelectedFilter] = useState("all-events"); // Default filter

  const [userPositionInfoWindow, setUserPositionInfoWindow] = useState(false); // State to manage the info window for the user's position
  const [myPostionRef, myPosition] = useAdvancedMarkerRef(); // Ref for the user's position marker
  const { user } = useContext(UserContext); // Get the user context
  const userImage = user?.profile_pic || null;
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredeEvents, setFilteredEvents] = useState([]); // Filtered posts
  const [SelectedEventId, setSelectedEventId] = useState(null); // State to manage selected event ID
  const [mapInstance, setMapInstance] = useState(null); // State to manage the map instance
  const [activeInfoWindowEventId, setActiveInfoWindowEventId] = useState(null);

  const enrichedEvents = useMemo(() => {
    if (!events || !geolocations) return [];

    return geolocations
      .map((geo) => {
        const fullEvent = events.find((e) => e.event_id === geo.event_id);
        return fullEvent && geo.lat && geo.lng
          ? { ...fullEvent, lat: geo.lat, lng: geo.lng }
          : null;
      })
      .filter(Boolean);
  }, [events, geolocations]);

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

  const handleCreateEvent = async (eventData) => {
    try {
      // Insert the event into the Supabase database
      const { data: eventInsertData, error: eventInsertError } = await supabase
        .from("events")
        .insert([
          {
            organizer_username: user?.username,
            event_time: eventData.event_time,
            title: eventData.title,
            description: eventData.description,
            date: eventData.date,
            street_address: eventData.street_address,
            location_city: eventData.location_city,
            location_state: eventData.location_state,
            location_country: eventData.location_country || "USA", // Default to USA
            image_url: eventData.image_url || null, // Optional image URL
            is_online: eventData.is_online,
          },
        ])
        .select("event_id");

      if (eventInsertError) {
        throw new Error(eventInsertError.message);
      }

      const newEventId = eventInsertData[0].event_id;

      // Insert tags into the event_event_tags table
      if (eventData.tags && eventData.tags.length > 0) {
        const { data: tagIds, error: tagFetchError } = await supabase
          .from("event_tags")
          .select("tag_id")
          .in("tag_name", eventData.tags);

        if (tagFetchError) {
          throw new Error(tagFetchError.message);
        }

        const tagInsertData = tagIds.map((tag) => ({
          event_id: newEventId,
          tag_id: tag.tag_id,
        }));

        const { error: tagInsertError } = await supabase
          .from("event_event_tags")
          .insert(tagInsertData);

        if (tagInsertError) {
          throw new Error(tagInsertError.message);
        }
      }

      // Update the local state with the new event
      const newEvent = {
        ...eventData,
        event_id: newEventId,
        tags: eventData.tags || [],
      };
      setFilteredEvents((prevEvents) => [...prevEvents, newEvent]);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

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
           * TODO:
           * make the logic of creating an event
           * change the tag logic for a better user experience
           * add a loading state when creating an event
           */}

          <CreateEventModal onSubmit={handleCreateEvent} />

          <div className="events-filter">
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
               * update the events when a new event is created
               *
               */}

              {filteredeEvents.length > 0 ? (
                filteredeEvents.map((event) => (
                  <EventsCard
                    eventId={event.event_id}
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

                {activeInfoWindowEventId &&
                  (() => {
                    const event = enrichedEvents.find(
                      (e) => e.event_id === activeInfoWindowEventId
                    );
                    if (!event) return null;

                    return (
                      <InfoWindow
                        position={{ lat: event.lat, lng: event.lng }}
                        onCloseClick={() => setActiveInfoWindowEventId(null)}
                      >
                        <EventsCard
                          eventId={event.event_id}
                          is_Online={event.is_online} // remember this is a boolean
                          key={`${event.event_id}-card`}
                          eventName={event.title}
                          date={new Date(event.date).toLocaleDateString()}
                          location={`${event.street_address}, ${event.location_city}, ${event.location_state}`}
                          tags={event.tag_names}
                        />
                      </InfoWindow>
                    );
                  })()}
                {enrichedEvents.map((event) => (
                  <AdvancedMarker
                    key={`${event.event_id}-marker`}
                    position={{ lat: event.lat, lng: event.lng }}
                    onClick={() => setActiveInfoWindowEventId(event.event_id)}
                  />
                ))}
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
      map.setZoom(zoomLevel); // simpler + avoids feedback loop
    };

    if (!selectedEventId) {
      if (userPosition?.lat && userPosition?.lng) {
        zoomTo(userPosition, 9); // Reset zoom when deselecting
      }
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
