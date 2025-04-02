import { useState } from "react";
import "../styles/dm-page.css";

// might need to change code for adding messages
const conversations = [
  { id: 1, name: "Batman", lastMessage: " hey" },
  { id: 2, name: "Harley Quinn", lastMessage: " u up" },
  { id: 3, name: "Riddler", lastMessage: " Wanna hear a riddle" },
];

const DMPage = () => {
  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [messages, setMessages] = useState({
    1: [{ sender: "deadpool", text: " hey" }],
    2: [{ sender: "spiderman", text: " u up" }],
    3: [{ sender: "Riddler", text: " Hello" }],
  });
  const [newMessage, setNewMessage] = useState("");


  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedChat.id]: [
          ...(prevMessages[selectedChat.id] || []),
          { sender: "You", text: newMessage },
        ],
      }));
      setNewMessage("");
    }
  };


  return (
    <div className="dm-container">
      <div className="sidebar">
        <h2>Messages</h2>
        {conversations.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${selectedChat.id === chat.id ? "active" : ""}`}
            onClick={() => setSelectedChat(chat)}
          >
            <span className="chat-name">{chat.name}</span>
            <span className="chat-last-message">
              {messages[chat.id]?.length > 0
                ? messages[chat.id][messages[chat.id].length - 1].text
                : "No messages yet"}
            </span>
          </div>
        ))}
      </div>


      <div className="chat-window">
        <div className="chat-header">{selectedChat.name}</div>
        <div className="chat-messages">
          {(messages[selectedChat.id] || []).map((msg, index) => (
            <div key={index} className={`message ${msg.sender === "You" ? "sent" : "received"}`}>
              {msg.text}
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
      </div>
    </div>
  );
};

export default DMPage;