import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../client";

const useStartConversation = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const startConversation = async (currentUserId, participantId) => {
    if (!currentUserId || !participantId) {
      if (!participantId) {
        alert("This is a fake profile.");
      } else {
        alert("Unable to start a conversation. Please try again.");
      }
      return;
    }

    if (currentUserId === participantId) {
      alert("You cannot start a conversation with yourself.");
      return;
    }

    setLoading(true);

    try {
      // Check for an existing conversation
      const { data: mappingData, error: mappingError } = await supabase
        .from("user_conversation")
        .select("conversation_id")
        .in("user_id", [currentUserId, participantId]);

      if (mappingError) {
        console.error("Error fetching conversation mappings:", mappingError);
        setLoading(false);
        return;
      }

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
        // Create a new conversation
        const { data, error: convError } = await supabase
          .from("conversations")
          .insert([
            {
              owner_user_id: currentUserId,
              Person1: currentUserId,
              Person2: participantId,
            },
          ])
          .select();

        if (convError) {
          console.error("Error creating conversation:", convError);
          setLoading(false);
          return;
        }

        conversation = data[0];

        // Map both users to the conversation
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

      // Navigate to the DM page
      navigate("/dm-page", { state: { conversationId: conversation.id } });
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  return { startConversation, loading };
};

export default useStartConversation;
