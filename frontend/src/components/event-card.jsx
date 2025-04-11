import React from "react";
import "../styles/event-card.css"; // Import your CSS file for styling

function EventsCard({ eventName, date, location, is_Online }) {
  return (
    <div className="events-card">
      <div className="events-card-content">
        <div className="events-card-header-and-date">
          <h3>{eventName}</h3>
          <time dateTime={date}>{date}</time>
        </div>
        <div className="events-tags">tags</div>
        <span className="events-location">{location}</span>
      </div>
    </div>
  );
}

export default EventsCard;
