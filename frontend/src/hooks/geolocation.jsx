import { useState, useEffect } from "react";
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
