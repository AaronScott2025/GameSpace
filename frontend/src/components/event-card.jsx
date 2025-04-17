import React from "react";
import Tags from "./tags";
import { Link } from "react-router-dom";
import "../styles/event-card.css"; // Import your CSS file for styling

function EventsCard({
  eventId,
  eventName,
  date,
  location,
  is_Online,
  tags,
  isSelected,
  onSelect,
}) {
  /**
   * TODO:
   * add a onClick event to the card that will trigger a focus on the map
   * and center it on the event location
   */
  return (
    <div
      className={`events-card ${isSelected ? "selected" : ""}`} // Add "selected" class if the card is selected
      onClick={onSelect} // Handle card selection
    >
      <div className="events-card-content">
        <div className="events-card-header-and-date">
          <Link
            to={`/events/${eventId}`}
            style={{ textDecoration: "none", color: "inherit" }}
            className="events-card-link"
          >
            <h3>{eventName}</h3>
          </Link>

          <time dateTime={date}>{date}</time>
        </div>
        <div className="events-tags">
          <Tags tagText={is_Online ? "Online" : "In-person"} />{" "}
          {tags.map((tag, index) => (
            <Tags key={index} tagText={tag} />
          ))}
        </div>
        <span className="events-location">{location}</span>
      </div>
    </div>
  );
}

export default EventsCard;
