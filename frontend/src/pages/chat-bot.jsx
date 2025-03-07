import React, { useState } from "react";
import { RiAliensFill } from "react-icons/ri"; // Import the icon
import "./chat-bot.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  // !!
  // not sure how the connection works
  // !!
  const sendMessage = async () => {
    if (input.trim() === "") return; // Don't send empty messages
    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]); // Add user message to chat
    setInput(""); // Clear input
    try {
      // Send the message to your backend
      const response = await axios.post("http://your-backend-url/chatbot/", {
        message: input,
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



  return (
    <div className="chat-container">
      <div className="chat-header">
        <RiAliensFill size={30} color="#00ff00" />
        <h3>ChatBot 4o</h3>
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
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBot;