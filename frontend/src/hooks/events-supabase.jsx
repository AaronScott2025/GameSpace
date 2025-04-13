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
