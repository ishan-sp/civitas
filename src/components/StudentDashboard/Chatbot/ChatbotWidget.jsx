import { useState } from 'react';
import Chatbot from './Chatbot';
import './ChatbotWidget.css';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatbot-widget">
      {!isOpen && (
        <button className="chat-toggle-button" onClick={toggleChat}>
          <span className="chat-icon">💬</span>
          <span className="chat-text">Need Help?</span>
        </button>
      )}
      <Chatbot isOpen={isOpen} toggleChat={toggleChat} />
    </div>
  );
};

export default ChatbotWidget; 