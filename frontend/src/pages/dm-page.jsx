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
  const [username, setUsername] = useState("");

  // Fetch the current user's username from the profiles table
  const fetchUsername = async (userId) => {
    console.log("Fetching username for:", userId);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      console.log("Fetched username data:", data);
      return data.username || "No username found";
    } catch (err) {
      console.error("Error fetching username:", err.message);
      return "Error fetching username";
    }
  };

  // On mount, fetch current user and update state
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }
      if (data.user) {
        setCurrentUser(data.user);
        fetchUsername(data.user.id).then(setUsername);
      }
    };
    fetchUser();
  }, []);

  // Fetch conversations mapped to the current user
  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser) return;

      // Query the mapping table for participant rows
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
      // Fetch conversation details from the conversations table
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

  // Fetch messages for the selected chat and subscribe to new ones
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

  // Send a new message in the current conversation
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

  // Search for users by username in the profiles table
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

  // Start a conversation with a selected user
  const startConversation = async (participantId, usernameFromProfile) => {
    if (!currentUser) {
      console.error("User not authenticated");
      return;
    }

    const userId = currentUser.id;
    const currentUsername = await fetchUsername(userId); // Ensure username is retrieved properly

    console.log("Starting conversation between", userId, "and", participantId);

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
      // Create a new conversation with the resolved username
      const { data, error: convError } = await supabase
        .from("conversations")
        .insert([
          {
            owner_user_id: userId,
            Person1: currentUsername, // Use current user's username
            Person2: usernameFromProfile,
          },
        ])
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

      // Insert rows into user_conversation for both participants
      const { error: mapError } = await supabase.from("user_conversation").insert([
        { user_id: userId, conversation_id: conversation.id },
        { user_id: participantId, conversation_id: conversation.id },
      ]);

      if (mapError) {
        console.error("Error mapping users to conversation:", mapError);
        return;
      }
    }

    // Update the conversation list locally and clear search fields
    setConversations((prev) =>
      prev.find((c) => c.id === conversation.id) ? prev : [...prev, conversation]
    );
    setSelectedChat(conversation);
    setSearchResults([]);
    setSearchQuery("");
  };

  // Get the username of the other participant in a conversation
  const getOtherUsername = (conversation) => {
    if (!currentUser) return "";
    return conversation.Person1 === username
      ? conversation.Person2
      : conversation.Person1;
  };

  return (
    <div className="dm-container">
      <div className="sidebar">
        <h2>Messages</h2>
        <div
          className="search-bar"
          style={{
            backgroundColor: "black",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{
              color: "white",
              backgroundColor: "black",
              border: "none",
              width: "100%",
            }}
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
            style={{
              backgroundColor: "black",
              marginTop: "5px",
              borderRadius: "5px",
            }}
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
            {/* Instead of chat.name, we show the other participant's username */}
            <span className="chat-name">{getOtherUsername(chat)}</span>
          </div>
        ))}
      </div>
      <div className="chat-window">
        {selectedChat ? (
          <>
            {/* Show the partner's name in the chat header */}
            <div className="chat-header">{getOtherUsername(selectedChat)}</div>
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.user_id === currentUser?.id ? "sent" : "received"
                  }`}
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
          <div className="chat-placeholder">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default DMPage;