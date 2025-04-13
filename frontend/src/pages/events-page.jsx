import React, { useState, useEffect, use } from "react";
import "../styles/events-page.css"; // Import your CSS file for styling
import { supabase } from "../../client.js"; // Shared client
import ButtonModal from "../components/button-modal";
import { IoMdAdd } from "react-icons/io";
import EventsCard from "../components/event-card.jsx";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
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

function EventsPage() {
  const { position, error, geoError } = useGeolocation();
  const { location, error: reverseGeoError } = useReverseGeocoding(position);
  const { data: events, error: tableWithTagsError } = useEventswithTags();
  const { geolocations, error: evntGeoError } = useEventsToGeo();
  const [selectedFilter, setSelectedFilter] = useState("all-events"); // Default filter

  const handleFilterChange = (filterName) => {
    setSelectedFilter(filterName); // Update the selected filter
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
          <ButtonModal
            buttonText={"Create Event"}
            modalClassName={"create-event-modal"}
            className={"create-event-button"}
            icon={IoMdAdd}
            iconSize={24}
            title={"Create New Event"}
            inputs={[
              { label: "Event Name", type: "text", name: "event_name" },
              { label: "Date", type: "date", name: "date" },
              { label: "Location", type: "text", name: "location" },
              { label: "Description", type: "textarea", name: "description" },
            ]}
            formClassName={"event-form"}
          />
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
              ></AdvancedMarker>
              {/**
               * style the markers to be more visible
               * TODO:
               * add a popup to the markers that shows the event name and date
               * limit the number of markers and calls to the api.
               */}
              {geolocations.map((event) =>
                event.lat && event.lng ? (
                  <AdvancedMarker
                    key={`${event.event_id}-marker`}
                    id={`${event.event_id}-marker`}
                    position={{ lat: event.lat, lng: event.lng }}
                  ></AdvancedMarker>
                ) : null
              )}
            </Map>
          </div>
        </main>
      </div>
    </APIProvider>
  );
}
export default EventsPage;
