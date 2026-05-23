function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`message ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-content">{message.content}</div>
    </div>
  );
}
export default ChatMessage;