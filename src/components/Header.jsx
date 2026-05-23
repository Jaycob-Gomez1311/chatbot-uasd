function Header({ onClearChat }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <img src="/escudo-uasd.png" alt="Escudo UASD" className="escudo" />
          <div className="header-title">
            <h1>Chatbot UASD</h1>
            <p>Consulta el Estatuto Orgánico de la UASD</p>
          </div>
        </div>
        <button className="clear-button" onClick={onClearChat} title="Nueva conversación">
          Nueva conversación
        </button>
      </div>
    </header>
  );
}

export default Header;