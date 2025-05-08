import React, { useState, useContext, useEffect  } from "react";
import { RiAliensFill } from "react-icons/ri"; // Import the icons
import { IoMdSend } from "react-icons/io";
import axios from "axios";
import { UserContext } from "./UserContext.jsx";

import "../styles/chat-bot.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Get the user from the UserContext
  const { user } = useContext(UserContext);

  
  // connection works / integration 
  const sendMessage = async () => {
    if (input.trim() === "") return; // Don't send empty messages
    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]); // Add user message to chat
    setInput(""); // Clear input
    try {
      // Send the message to your backend
      const response = await axios.post("/api/chatbot/", {
        message: input,
        userinfo: {
          username: user.username,
          email: user.email,
          bio: user.bio,
          favoritegames: user.favorites_games,
        },
      });
      const botMessage = { text: response.data.response, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]); //  bot response
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Sorry, something went wrong.", sender: "bot" },
      ]);
    }
  };

  useEffect(() => {
    if (user) {
      const initialMessage = {
        text: "Hello! I am GameSpace Guru, a Chatbot to help you navigate GameSpace. How can I assist you today?",
        sender: "bot"
      };
      setMessages([initialMessage]); // Set initial bot message
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <RiAliensFill size={30} color="#00ff00" />
        <h3>GameSpace Guru</h3>
      </div>
      <div className="chat-box">
        {messages.map((message, index) => (
          <div
            key={index}
            className={message.sender === "user" ? "chat-user" : "chat-bot"}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
              console.log(e.key)
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>
          <IoMdSend size={26} color="#fff" />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
