import React from "react";
import "../styles/events-page.css"; // Import your CSS file for styling
import { supabase } from "../../client.js"; // Shared client
import ButtonModal from "../components/button-modal";
import { IoMdAdd } from "react-icons/io";
import { createRoot } from "react-dom/client";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

function EventsPage() {
  const postion = { lat: 40.7540817261, lng: -73.4263687134 }; // Default position for the map
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}>
      <div className="events-page">
        <aside className="events-sidebar">
          <h2 className="events-title">Events</h2>
          <div className="search-bar">
            <input type="text" placeholder="Search" />
          </div>
          {/* ButtonModal will change to handle tags */}
          <ButtonModal
            buttonText={"Create Event"}
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
          <ul className="events-list">
            <li>Event 1</li>
            <li>Event 2</li>
            <li>Event 3</li>
            {/* Add more events as needed */}
          </ul>
        </aside>
        <main className="events-content">
          <span>Your location should be here</span>
          <Map
            style={{ width: "80vw", height: "70vh" }}
            center={postion}
            defaultZoom={9}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
            mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
          >
            <AdvancedMarker id="marker-1" position={postion}></AdvancedMarker>
          </Map>
        </main>
      </div>
    </APIProvider>
  );
}
export default EventsPage;
