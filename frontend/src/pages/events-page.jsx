import React, { useState, useEffect } from "react";
import "../styles/events-page.css"; // Import CSS with new modal styles
import { supabase } from "../../client.js"; // Shared client
import { IoMdAdd } from "react-icons/io";
import EventsCard from "../components/event-card.jsx";
import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
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
import CreateEventModal from "../components/create-event-modal"; // Import the new modal component

function EventsPage() {
  const { position, error, geoError } = useGeolocation();
  const { location, error: reverseGeoError } = useReverseGeocoding(position);
  const { data: events, error: tableWithTagsError, refetchEvents } = useEventswithTags();
  const { geolocations, error: evntGeoError } = useEventsToGeo();
  const [selectedFilter, setSelectedFilter] = useState("all-events"); // Default filter
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  // Filter events based on selected filter
  useEffect(() => {
    if (!events) return;

    if (selectedFilter === "all-events") {
      setFilteredEvents(events);
    } else if (selectedFilter === "online") {
      setFilteredEvents(events.filter(event => event.is_online));
    } else if (selectedFilter === "in-person") {
      setFilteredEvents(events.filter(event => !event.is_online));
    }
  }, [selectedFilter, events]);

  const handleFilterChange = (filterName) => {
    setSelectedFilter(filterName); // Update the selected filter
  };

  // Handle event creation submission
  const handleEventSubmit = async (formData) => {
    try {
      // Format the data for Supabase
      const eventData = {
        title: formData.title,
        date: formData.date,
        time: formData.time,
        description: formData.description,
        is_online: formData.is_online,
        street_address: formData.street_address,
        location_city: formData.location_city,
        location_state: formData.location_state,
        created_at: new Date().toISOString(),
      };

      // Insert the event into the events table
      const { data: eventInsert, error: eventError } = await supabase
        .from('events')
        .insert(eventData)
        .select();

      if (eventError) throw eventError;

      // If there are tags selected, add them to the event_tags junction table
      if (formData.tags && formData.tags.length > 0) {
        // First get the tag IDs from the tag names
        const { data: tagData, error: tagError } = await supabase
          .from('tags')
          .select('tag_id, name')
          .in('name', formData.tags);

        if (tagError) throw tagError;

        // Create tag-event relationships in the junction table
        if (tagData && tagData.length > 0) {
          const eventTagRelations = tagData.map(tag => ({
            event_id: eventInsert[0].event_id,
            tag_id: tag.tag_id
          }));

          const { error: relationError } = await supabase
            .from('event_tags')
            .insert(eventTagRelations);

          if (relationError) throw relationError;
        }
      }

      // Refetch events to update the UI
      refetchEvents();

      alert('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  // Handle clicking on an event card
  const handleEventCardClick = (event) => {
    setSelectedEvent(event);

    // Find the corresponding marker
    const eventLocation = geolocations.find(loc => loc.event_id === event.event_id);

    if (eventLocation && mapInstance) {
      // Center map on the event location
      mapInstance.panTo({ lat: eventLocation.lat, lng: eventLocation.lng });
      mapInstance.setZoom(13);

      // Set the selected marker to show info window
      setSelectedMarker(eventLocation);
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

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}>
      <div className="events-page">
        {renderErrors()} {/* Display errors at the top of the page */}
        <aside className="events-sidebar">
          <h2 className="events-title">Events</h2>
          <div className="search-bar">
            <input type="text" placeholder="Search" />
          </div>

          {/* Replace ButtonModal with new CreateEventModal */}
          <CreateEventModal onSubmit={handleEventSubmit} />

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
          <div className="events-cards-container">
            {filteredEvents.map((event) => (
              <div
                key={`${event.event_id}-card-wrapper`}
                onClick={() => handleEventCardClick(event)}
              >
                <EventsCard
                  is_Online={event.is_online}
                  key={`${event.event_id}-card`}
                  eventName={event.title}
                  date={event.date}
                  location={`${event.street_address}, ${event.location_city}, ${event.location_state}`}
                  tags={event.tag_names}
                />
              </div>
            ))}
          </div>
        </aside>
        <main>
          <header className="map-header">
            <FaLocationDot color="red" />
            <span>
              {location && location.city
                ? `${location.city}, ${location.state}`
                : "Fetching address..."}
            </span>
          </header>

          <div className="map-container">
            <Map
              style={{
                width: "70vw",
                height: "75vh",
                position: "relative",
                zIndex: 0,
              }}
              defaultCenter={position}
              defaultZoom={9}
              gestureHandling={"greedy"}
              disableDefaultUI={true}
              mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
              onLoad={(map) => setMapInstance(map)}
            >
              {/* User's location marker */}
              <AdvancedMarker
                id="Your-Location"
                position={position}
              >
                <div className="user-location-marker">
                  <FaLocationDot color="blue" size={24} />
                </div>
              </AdvancedMarker>

              {/* Event markers with info windows */}
              {geolocations.map((event) =>
                event.lat && event.lng ? (
                  <AdvancedMarker
                    key={`${event.event_id}-marker`}
                    id={`${event.event_id}-marker`}
                    position={{ lat: event.lat, lng: event.lng }}
                    onClick={() => setSelectedMarker(event)}
                  >
                    <div className="event-marker">
                      <FaLocationDot color="red" size={24} />
                    </div>

                    {selectedMarker && selectedMarker.event_id === event.event_id && (
                      <InfoWindow
                        position={{ lat: event.lat, lng: event.lng }}
                        onCloseClick={() => setSelectedMarker(null)}
                      >
                        <div className="event-info-window">
                          <h3>{event.title}</h3>
                          <p><strong>Date:</strong> {event.date}</p>
                          <p><strong>Location:</strong> {event.location_city}, {event.location_state}</p>
                        </div>
                      </InfoWindow>
                    )}
                  </AdvancedMarker>
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