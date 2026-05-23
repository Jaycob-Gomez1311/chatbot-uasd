import { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

function ChatWindow({ messages, isLoading }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="chat-window">
      {messages.map((msg, idx) => (
        <ChatMessage key={idx} message={msg} />
      ))}
      {isLoading && (
        <div className="message assistant loading">
          <div className="message-content">Pensando...</div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatWindow;