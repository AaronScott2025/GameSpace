import React, { useState, useEffect, use } from "react";
import "../styles/events-page.css"; // Import your CSS file for styling
import { supabase } from "../../client.js"; // Shared client
import ButtonModal from "../components/button-modal";
import { IoMdAdd } from "react-icons/io";
import EventsCard from "../components/event-card.jsx";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

function EventsPage() {
  const [position, setPosition] = useState({
    lat: 40.7540817261,
    lng: -73.4263687134,
  }); // farmigdale, NY,

  // TODO:
  // Figure out how to get the user location
  // and set the map center to that location
  // const [position, setPosition] = useState({ lat: 0, lng: 0 });
  // advancedMarker for user location
  // place events location on the map with the AdvancedMarker component

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}>
      <div className="events-page">
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
           * better way to handle location
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
          <div className="events-cards-container">
            {/**
             * TODO:
             * Fetch events from the database and display them here
             * Use the EventsCard component to display each event
             * Make sure to pass the correct props to the EventsCard component
             * Use the supabase client to fetch the events from the database
             * allow scrolling to load more events, without allowing the cards to overflow out of the container
             */}
            <EventsCard
              eventName={"Anime Expo"}
              date={"2023-10-01"}
              location={"123st Street, Los Angeles, CA, USA"}
              tags={["Anime", "Expo", "Cosplay"]}
            />
            <EventsCard
              eventName={"Anime Expo"}
              date={"2023-10-01"}
              location={"123st Street, Los Angeles, CA, USA"}
              tags={["Anime", "Expo", "Cosplay"]}
            />
            <EventsCard
              eventName={"Anime Expo"}
              date={"2023-10-01"}
              location={"123st Street, Los Angeles, CA, USA"}
              tags={["Anime", "Expo", "Cosplay"]}
            />
            <EventsCard
              eventName={"Anime Expo"}
              date={"2023-10-01"}
              location={"123st Street, Los Angeles, CA, USA"}
              tags={["Anime", "Expo", "Cosplay"]}
            />
            <EventsCard
              eventName={"Anime Expo"}
              date={"2023-10-01"}
              location={"123st Street, Los Angeles, CA, USA"}
              tags={["Anime", "Expo", "Cosplay"]}
            />
          </div>
        </aside>
        <main>
          <span>Your location should be here</span>
          <div className="map-container">
            <Map
              style={{
                width: "70vw",
                height: "75vh",
                position: "relative",
                zIndex: 0, // Ensure the map stays behind the modal
              }}
              center={position}
              defaultZoom={9}
              gestureHandling={"greedy"}
              disableDefaultUI={true}
              mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
            >
              <AdvancedMarker
                id="marker-1"
                position={position}
              ></AdvancedMarker>
            </Map>
          </div>
        </main>
      </div>
    </APIProvider>
  );
}
export default EventsPage;
