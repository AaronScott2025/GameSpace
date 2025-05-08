import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../client.js";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import "../styles/event-info.css";

const EventDetailPage = () => {
  const { eventId } = useParams();
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("event_id", eventId)
        .single();

      if (error) {
        console.error("Error fetching event:", error);
      } else {
        setEventData(data);
      }
    };

    fetchEvent();
  }, [eventId]);

  const toggleRSVP = () => {
    setIsRSVPOpen(!isRSVPOpen);
  };

  if (!eventData) return <div>Loading event details...</div>;

  return (
    <div className="event-detail-page">
      <div className="event-info-container">
        <div className="event-text-content">
          <div className="event-name">{eventData.title}</div>
          <div className="event-organizer">
            <strong>Organizer:</strong> {eventData.organizer_username}
          </div>
          <div className="event-description">{eventData.description}</div>
          <div className="event-location">
            {eventData.is_online
              ? "Online"
              : `${eventData.street_address}, ${eventData.location_city}, ${eventData.location_state}, ${eventData.location_country}`}
          </div>
        </div>

        <div className="event-image-container">
          <img src="/planet.png" alt="Event" className="event-image" />
          <button onClick={toggleRSVP} className="rsvp-button">RSVP</button>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="event-map-container">
        {eventData.is_online ? (
        <img src="/online_event.jpg" alt="online" className="online" />
        ) : (
          <GoogleEventMap
            address={`${eventData.street_address}, ${eventData.location_city}, ${eventData.location_state}, ${eventData.location_country}`}
          />
        )}
      </div>

      {/* RSVP Modal */}
      {isRSVPOpen && (
        <div className="rsvp-modal">
          <div className="rsvp-modal-content">
            <button onClick={toggleRSVP} className="rsvp-close-button">×</button>
            <h2>RSVP for Event</h2>
            <form>
              <label>Name:</label>
              <input type="text" placeholder="Your Name" required />
              <label>Email:</label>
              <input type="email" placeholder="Your Email" required />
              <button type="submit" className="rsvp-submit-button">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const GoogleEventMap = ({ address }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    libraries: ['places'],
  });

  const [location, setLocation] = useState(null);

  useEffect(() => {
    const geocodeAddress = async () => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results[0]) {
          const { lat, lng } = results[0].geometry.location;
          setLocation({ lat: lat(), lng: lng() });
        } else {
          console.error("Geocode failed: " + status);
        }
      });
    };

    if (isLoaded) geocodeAddress();
  }, [isLoaded, address]);

  if (!isLoaded) return <p>Loading map...</p>;
  if (!location) return <p>Locating event...</p>;

  return (
    <GoogleMap
      center={location}
      zoom={15}
      mapContainerStyle={{
        width: "100%",
        height: "300px",
        borderRadius: "12px",
        marginTop: "1rem",
      }}
    >
      <Marker position={location} />
    </GoogleMap>
  );
};

export default EventDetailPage;
