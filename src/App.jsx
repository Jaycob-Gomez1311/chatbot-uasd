import { useState } from 'react';
import './App.css';
import ChatWindow from './components/ChatWindow';
import InputArea from './components/InputArea';
import SuggestedQuestions from './components/SuggestedQuestions';
import Header from './components/Header';
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  const [messages, setMessages] = useLocalStorage('chatHistory', []);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    try {
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });
      const data = await response.json();
      const botMsg = { role: 'assistant', content: data.answer };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = { role: 'assistant', content: 'Error al conectar con el servidor.' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
  };

  return (
    <div className="app">
      <Header onClearChat={clearChat} />
      <ChatWindow messages={messages} isLoading={isLoading} />
      <SuggestedQuestions onSelect={sendMessage} />
      <InputArea onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}

export default App;