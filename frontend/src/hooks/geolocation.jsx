import { useState, useEffect } from "react";
import { supabase } from "../../client";

import axios from "axios";

export const useGeolocation = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  return { position, error };
};

export const useReverseGeocoding = (position) => {
  const [location, setLocation] = useState({ city: "", state: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      if (position) {
        try {
          const response = await axios.get(
            "https://us1.locationiq.com/v1/reverse",
            {
              params: {
                key: import.meta.env.VITE_LOCATIONIQ_API_TOKEN,
                lat: position.lat,
                lon: position.lng,
                format: "json",
              },
            }
          );

          // Extract city and state from the response
          const { city, state } = response.data.address;
          setLocation({ city, state });
        } catch (err) {
          setError(err.message);
        }
      }
    };

    fetchAddress();
  }, [position]);

  return { location, error };
};

export const useEventsToGeo = () => {
  const [geolocations, setGeolocations] = useState([]); // Store geolocations
  const [error, setError] = useState(null); // Store errors
  const [loading, setLoading] = useState(false); // Track loading state

  useEffect(() => {
    const fetchEventsAndGeocode = async () => {
      try {
        setLoading(true); // Start loading
        // Fetch events from the database
        const { data: events, error: dbError } = await supabase.from("events")
          .select(`
              event_id,
              street_address,
              location_city,
              location_state,
              location_country
            `);

        if (dbError) throw dbError;

        const geocodedEvents = [];
        for (const event of events) {
          try {
            const response = await axios.get(
              "https://maps.googleapis.com/maps/api/geocode/json",
              {
                params: {
                  address: `${event.street_address}, ${event.location_city}, ${event.location_state}, ${event.location_country}`,
                  key: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
                },
              }
            );

            if (response.data.status === "OK") {
              const { lat, lng } = response.data.results[0].geometry.location;
              geocodedEvents.push({ ...event, lat, lng });
            } else {
              console.error(
                `Error geocoding event ${event.event_id}: ${response.data.status}`
              );
            }
          } catch (geoError) {
            console.error(
              `Error geocoding event ${event.event_id}: ${geoError.message}`
            );
          }
        }

        setGeolocations(geocodedEvents); // Update geolocations state
      } catch (err) {
        setError(err.message); // Update error state
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchEventsAndGeocode();
  }, []);

  return { geolocations, error, loading };
};
