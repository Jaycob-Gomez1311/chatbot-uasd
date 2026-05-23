import { useState } from 'react';

function InputArea({ onSend, disabled }) {
  const [input, setInput] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };
  return (
    <form className="input-area" onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe tu pregunta sobre el Estatuto de la UASD..."
        disabled={disabled}
      />
      <button type="submit" disabled={disabled}>Enviar</button>
    </form>
  );
}
export default InputArea;