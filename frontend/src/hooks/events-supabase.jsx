import { useState, useEffect } from "react";
import { supabase } from "../../client";

export const useEventsTable = (tableName) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from(tableName).select("*");
        if (error) throw error;
        setData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [tableName]);

  return { data, error };
};

export const useEventswithTags = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventsWithTags = async () => {
      try {
        const { data, error } = await supabase.from("events").select(
          `
              event_id,
              title,
              street_address,
              location_state,
              location_city,
              date,
              event_event_tags (
                event_tags ( tag_name )
              )
            `
        );

        if (error) throw error;

        // Transform the data to aggregate tags into an array
        const transformedData = data.map((event) => ({
          event_id: event.event_id,
          title: event.title,
          street_address: event.street_address,
          location_state: event.location_state,
          location_city: event.location_city,
          date: event.date,
          tag_names: event.event_event_tags.map(
            (tag) => tag.event_tags.tag_name
          ),
        }));

        setData(transformedData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEventsWithTags();
  }, []);

  return { data, error };
};
