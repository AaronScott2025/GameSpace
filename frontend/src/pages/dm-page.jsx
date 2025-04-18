import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "../styles/dm-page.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_REACT_APP_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_REACT_APP_API_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DMPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setCurrentUser(data.user);
      }
    };
    fetchUser();
  }, []);

  // Fetch conversations for the current user using the mapping table
  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser) return;

      // Query the mapping table (USER_CONVERSATION) for participant rows
      const { data: mappings, error: mappingError } = await supabase
        .from("user_conversation")
        .select("conversation_id")
        .eq("user_id", currentUser.id);

      if (mappingError) {
        console.error("Error fetching conversation mappings:", mappingError);
        return;
      }
      const conversationIds = mappings.map((m) => m.conversation_id);
      if (conversationIds.length === 0) {
        setConversations([]);
        return;
      }
      // Fetch conversation details from the CONVERSATIONS table
      const { data: convos, error: convError } = await supabase
        .from("conversations")
        .select("*")
        .in("id", conversationIds);
      if (convError) {
        console.error("Error fetching conversations:", convError);
      } else {
        setConversations(convos);
      }
    };

    fetchConversations();
  }, [currentUser]);

  // When a conversation is selected, fetch its messages and subscribe for realtime updates.
  useEffect(() => {
    if (selectedChat) {
      const fetchMessages = async () => {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", selectedChat.id)
          .order("created_at", { ascending: true });
        if (error) {
          console.error("Error fetching messages:", error);
        } else {
          setMessages(data);
        }
      };

      fetchMessages();

      // Setup realtime subscription for new messages
      const subscription = supabase
        .channel("public:messages")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => {
            if (payload.new.conversation_id === selectedChat.id) {
              setMessages((prevMessages) => [...prevMessages, payload.new]);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [selectedChat]);

  // Send a new message
  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedChat && currentUser) {
      const { error } = await supabase.from("messages").insert([
        {
          conversation_id: selectedChat.id,
          user_id: currentUser.id,
          message: newMessage,
        },
      ]);
      if (error) {
        console.error("Error sending message:", error);
      } else {
        setNewMessage("");
      }
    }
  };

  // Search for users from the PROFILES table (returns id and username)
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_id, username")
        .ilike("username", `%${searchQuery}%`);
      if (error) {
        console.error("Error searching profiles:", error);
      } else {
        setSearchResults(data);
      }
    }
  };

  // Start (or retrieve) a conversation between the current user and the selected participant.
  const startConversation = async (participantId, username) => {
    if (!currentUser) {
      console.error("User not authenticated");
      return;
    }
    const userId = currentUser.id;
    console.log("Starting conversation between", userId, "and", participantId);

    // -----------------------------------------------------------
    // Check if a conversation already exists for both participants.
    // We do this by querying the mapping table for rows for both the current user and the participant.
    console.log(participantId);
    const { data: mappingData, error: mappingError } = await supabase
      .from("user_conversation")
      .select("conversation_id")
      .in("user_id", [userId, participantId]);
    if (mappingError) {
      console.error("Error fetching conversation mappings:", mappingError);
      return;
    }
    const countByConvo = {};
    mappingData.forEach((entry) => {
      countByConvo[entry.conversation_id] =
        (countByConvo[entry.conversation_id] || 0) + 1;
    });
    // For a DM, a common conversation should have 2 rows (one for each user)
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
        return;
      }
      conversation = data;
    } else {
      // Create a new conversation
      const { data, error: convError } = await supabase
        .from("conversations")
        .insert([{ owner_user_id: userId, name: username }])
        .select();
      if (convError) {
        console.error("Error creating conversation:", convError);
        return;
      }
      if (!data || data.length === 0) {
        console.error("No conversation returned after insertion");
        return;
      }
      conversation = data[0];
      // Insert rows into USER_CONVERSATION for both participants (requires a user_id column)
      const { error: mapError } = await supabase.from("user_conversation").insert([
        { user_id: userId, conversation_id: conversation.id },
        { user_id: participantId, conversation_id: conversation.id },
      ]);
      if (mapError) {
        console.error("Error mapping users to conversation:", mapError);
        return;
      }
    }
    // Update the conversation list locally (if not already present)
    setConversations((prev) => {
      if (prev.find((c) => c.id === conversation.id)) return prev;
      else return [...prev, conversation];
    });
    setSelectedChat(conversation);
    setSearchResults([]);
    setSearchQuery("");
  };

  return (
    <div className="dm-container">
      <div className="sidebar">
        <h2>Messages</h2>
        <div
          className="search-bar"
          style={{ backgroundColor: "black", padding: "10px", borderRadius: "5px" }}
        >
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{ color: "white", backgroundColor: "black", border: "none", width: "100%" }}
          />
          <button
            onClick={handleSearch}
            style={{ color: "white", backgroundColor: "gray", marginTop: "10px" }}
          >
            Search
          </button>
        </div>
        {searchResults.length > 0 && (
          <div
            className="search-results"
            style={{ backgroundColor: "black", marginTop: "5px", borderRadius: "5px" }}
          >
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="search-result-item"
                onClick={() => startConversation(user.user_id, user.username)}
                style={{
                  color: "white",
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid gray",
                }}
              >
                {user.username}
              </div>
            ))}
          </div>
        )}
        {conversations.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${selectedChat?.id === chat.id ? "active" : ""}`}
            onClick={() => setSelectedChat(chat)}
          >
            <span className="chat-name">{chat.name}</span>
          </div>
        ))}
      </div>
      <div className="chat-window">
        {selectedChat ? (
          <>
            <div className="chat-header">{selectedChat.name}</div>
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.user_id === currentUser?.id ? "sent" : "received"}`}
                >
                  {msg.message}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="chat-placeholder">Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
};

export default DMPage;