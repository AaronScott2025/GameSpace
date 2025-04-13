import React, { useState } from "react";
import "../styles/event-info.css";

const EventDetailPage = () => {
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);

  const toggleRSVP = () => {
    setIsRSVPOpen(!isRSVPOpen);
  };

  return (
    <div className="event-detail-page">
      {/* TOP INFO CONTAINER */}
      <div className="event-info-container">
        {/* LEFT SIDE TEXT */}
        <div className="event-text-content">
          <div className="event-name">Event Name Here</div>
          <div className="event-organizer"><strong>Organizer:</strong> John Doe</div>
          <div className="event-description">
            Description of the event goes here. It could be multiple lines and should give more context about the event.
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="event-image-container">
          <img src="/planet.png" alt="Event" className="event-image" />
          {/* RSVP Button */}
          <button onClick={toggleRSVP} className="rsvp-button">RSVP</button>
        </div>
      </div>

      {/* BOTTOM MAP CONTAINER */}
      <div className="event-map-container">
        <h2>Map</h2>
        <div id="map">
          {/* Map content goes here */}
        </div>
      </div>

      {/* RSVP Modal */}
      {isRSVPOpen && (
        <div className="rsvp-modal">
          <div className="rsvp-modal-content">
            {/* Close Button as "X" */}
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
