import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../client";
import { UserContext } from "../pages/UserContext";
import { createClient } from "@supabase/supabase-js";

// Reuse your Supabase configuration
// const supabaseUrl = import.meta.env.VITE_SUPABASE_REACT_APP_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_REACT_APP_API_KEY;
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

const StartDmButton = ({ currentUserId, participantId }) => {
  const { user } = useContext(UserContext); // user context has the current user that is logged in
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // // Helper method to fetch the username for any given user ID
  const fetchUsername = async (userId) => {
    if (!userId) {
      console.error("Invalid userId:", userId);
      return "Invalid user ID";
    }
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("user_id", userId)
        .single();
      if (error) throw error;
      return data.username || "No username found";
    } catch (err) {
      console.error("Error fetching username:", err.message);
      return "Error fetching username";
    }
  };

  // Method mirroring the DMPage startConversation logic
  const startConversation = async () => {
    if (!currentUserId || !participantId) {
      console.error("Missing user IDs:", { currentUserId, participantId });
      alert("Unable to start a conversation. Please try again.");
      return;
    }

    // Check if the user is trying to start a conversation with themselves
    if (currentUserId === participantId) {
      alert("You cannot start a conversation with yourself.");
      return;
    }

    setLoading(true);

    const currentUsername = await fetchUsername(currentUserId);
    const participantUsername = await fetchUsername(participantId);

    if (
      currentUsername === "Invalid user ID" ||
      participantUsername === "Invalid user ID"
    ) {
      setLoading(false);
      alert("Invalid user IDs. Please try again.");
      return;
    }

    // Check for an existing conversation between these users via the mapping table
    const { data: mappingData, error: mappingError } = await supabase
      .from("user_conversation")
      .select("conversation_id")
      .in("user_id", [currentUserId, participantId]); // use pass as props to the popup

    if (mappingError) {
      console.error("Error fetching conversation mappings:", mappingError);
      setLoading(false);
      return;
    }

    // Calculate if a conversation exists (error free if both group rows exist)
    const countByConvo = {};
    mappingData.forEach((entry) => {
      countByConvo[entry.conversation_id] =
        (countByConvo[entry.conversation_id] || 0) + 1;
    });
    const commonConvoId = Object.keys(countByConvo).find(
      (id) => countByConvo[id] === 2
    );
    let conversation;

    if (commonConvoId) {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", commonConvoId)
        .maybeSingle();
      if (error) {
        console.error("Error fetching conversation:", error);
        setLoading(false);
        return;
      }
      conversation = data;
    } else {
      // No conversation exists, so create one using the fetched usernames
      const { data, error: convError } = await supabase
        .from("conversations")
        .insert([
          {
            owner_user_id: currentUserId,
            Person1: currentUsername,
            Person2: participantUsername,
          },
        ])
        .select();

      if (convError) {
        console.error("Error creating conversation:", convError);
        setLoading(false);
        return;
      }
      if (!data || data.length === 0) {
        console.error("No conversation returned after insertion");
        setLoading(false);
        return;
      }
      conversation = data[0];

      // Map both users to the newly created conversation
      const { error: mapError } = await supabase
        .from("user_conversation")
        .insert([
          { user_id: currentUserId, conversation_id: conversation.id },
          { user_id: participantId, conversation_id: conversation.id },
        ]);
      if (mapError) {
        console.error("Error mapping users to conversation:", mapError);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    // After starting the conversation, navigate to the DM page.
    navigate("/dm-page", { state: { conversationId: conversation.id } });
  };

  return (
    <button onClick={startConversation} disabled={loading}>
      {loading ? "Starting..." : "Start Dm"}
    </button>
  );
};

export default StartDmButton;
