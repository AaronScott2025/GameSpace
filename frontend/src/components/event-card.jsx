import React from "react";
import Tags from "./tags";
import "../styles/event-card.css"; // Import your CSS file for styling

function EventsCard({ eventId, eventName, date, location, is_Online, tags }) {
  /**
   * TODO:
   * add a onClick event to the card that will trigger a focus on the map
   * and center it on the event location
   */
  return (
    <div className="events-card" id={eventId}>
      <div className="events-card-content">
        <div className="events-card-header-and-date">
          <h3>{eventName}</h3>
          <time dateTime={date}>{date}</time>
        </div>
        <div className="events-tags">
          {tags.map((tag, index) => (
            <Tags key={index} tagText={tag} /> // Render a Tags component for each tag
          ))}
        </div>
        <span className="events-location">{location}</span>
      </div>
    </div>
  );
}

export default EventsCard;
