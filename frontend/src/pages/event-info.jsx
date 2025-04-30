import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../client.js";
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

  const getStaticMapUrl = (eventData) => {
    if (eventData.is_online) return null; // No map for online events

    const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY; // Using environment variable for API key
    const address = `${eventData.street_address}, ${eventData.location_city}, ${eventData.location_state}, ${eventData.location_country}`;
    const encodedAddress = encodeURIComponent(address);

    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7Clabel:E%7C${encodedAddress}&key=${apiKey}`;
    
    console.log("Generated Map URL: ", mapUrl); // Debug log
    
    return mapUrl;
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

        {/* IMAGE */}
        <div className="event-image-container">
          <img src="/planet.png" alt="Event" className="event-image" />
          <button onClick={toggleRSVP} className="rsvp-button">RSVP</button>
        </div>
      </div>

      {/* BOTTOM MAP CONTAINER */}
      <div className="event-map-container">
        <div id="map">
          {eventData.is_online ? (
            <p>This is an online event, no physical map available.</p>
          ) : (
            <img
              src={getStaticMapUrl(eventData)}
              alt="Event Location"
              className="event-map"
            />
          )}
        </div>
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

export default EventDetailPage;
