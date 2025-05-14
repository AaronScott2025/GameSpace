import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../client.js";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import "../styles/event-info.css";

const EventDetailPage = () => {
  const { eventId } = useParams();
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [guestList, setGuestList] = useState([]);
  const [showGuestModal, setShowGuestModal] = useState(false);

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

  const fetchGuestList = async () => {
    const { data, error } = await supabase
      .from("rsvps")
      .select("username, email")
      .eq("event_id", eventId);

    if (error) {
      console.error("Error fetching guest list:", error);
    } else {
      setGuestList(data);
      setShowGuestModal(true);
    }
  };

  const handleRSVPSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();

    if (!name || !email) {
      alert("Please provide both your name and email.");
      return;
    }

    const { error } = await supabase.from("rsvps").insert({
      event_id: eventData.event_id,
      username: name,
      email: email,
    });

    if (error) {
      console.error("RSVP failed:", error.message);
      alert("RSVP submission failed. Please try again later.");
    } else {
      alert("RSVP submitted successfully!");
      setIsRSVPOpen(false);
    }
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
          <button onClick={fetchGuestList} className="guest-list-button">
            View Guest List
          </button>
        </div>

        <div className="event-image-container">
          <img src="/planet.png" alt="Event" className="event-image" />
          <button onClick={toggleRSVP} className="rsvp-button">RSVP</button>
        </div>
      </div>

      <div className="event-map-container">
        {eventData.is_online ? (
          <img src="/online_event.jpg" alt="online" className="online" />
        ) : (
          <GoogleEventMap
            address={`${eventData.street_address}, ${eventData.location_city}, ${eventData.location_state}, ${eventData.location_country}`}
          />
        )}
      </div>

      {isRSVPOpen && (
        <div className="rsvp-modal">
          <div className="rsvp-modal-content">
            <button onClick={toggleRSVP} className="rsvp-close-button">×</button>
            <h2>RSVP for Event</h2>
            <form onSubmit={handleRSVPSubmit}>
              <label>Name:</label>
              <input type="text" name="name" placeholder="Your Name" required />
              <label>Email:</label>
              <input type="email" name="email" placeholder="Your Email" required />
              <button type="submit" className="rsvp-submit-button">Submit</button>
            </form>
          </div>
        </div>
      )}

      {showGuestModal && (
        <div className="rsvp-modal">
          <div className="rsvp-modal-content">
            <button onClick={() => setShowGuestModal(false)} className="rsvp-close-button">×</button>
            <h2>Guest List</h2>
            {guestList.length > 0 ? (
              <ul>
                {guestList.map((guest, idx) => (
                  <li key={idx}>
                    <strong>{guest.username}</strong> ({guest.email})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No guests have RSVP’d yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const GoogleEventMap = ({ address }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    libraries: ["places"],
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
