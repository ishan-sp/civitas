import { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

// Azure OpenAI API credentials
const API_KEY = "Ax80ppCsRf3baI69t4Ww7WdIgE2ywqwmoxVQk8WXiX5rN2Q6bYv0JQQJ99BCACHYHv6XJ3w3AAAAACOGTC2b";
const AZURE_ENDPOINT = "https://ai-graphitestorm8466ai385706727975.services.ai.azure.com";
const API_VERSION = "2023-07-01-preview";
const MODEL_NAME = "gpt-4o";

const Chatbot = ({ isOpen, toggleChat }) => {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a helpful assistant that helps students resolve their academic doubts and queries. Keep your responses short, crisp, and brief. Avoid lengthy explanations. Use simple language and get straight to the point.' },
    { role: 'assistant', content: 'Hi! How can I help with your studies today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetchAIResponse([...messages, userMessage]);
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAIResponse = async (messageHistory) => {
    try {
      const response = await fetch(`${AZURE_ENDPOINT}/openai/deployments/${MODEL_NAME}/chat/completions?api-version=${API_VERSION}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': API_KEY
        },
        body: JSON.stringify({
          messages: messageHistory,
          max_tokens: 400,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const cleanedContent = data.choices[0].message.content.replace(/\*/g, '');
      return cleanedContent;
    } catch (error) {
      console.error('Error in API request:', error);
      throw error;
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <div className="chatbot-header">
        <h3>Student Support</h3>
        <button className="close-button" onClick={toggleChat}>×</button>
      </div>
      <div className="chatbot-messages">
        {messages.filter(msg => msg.role !== 'system').map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-content">{message.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="chatbot-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your question here..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || input.trim() === ''}>
          {isLoading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chatbot; 