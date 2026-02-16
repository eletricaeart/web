import React from "react";
import "./EAButton.css";

const EAButton = ({
  icon1 = "",
  icon2 = null,
  text1 = "",
  text2 = null,
  bg = null,
  plain = false,
  active = false,
  onClick,
}) => {
  // Define qual ícone e texto exibir com base no estado 'active'
  const currentIcon = active ? icon2 || icon1 : icon1;
  const currentText = active ? text2 || text1 : text1;

  // Lógica de estilo dinâmico original
  const getButtonStyle = () => {
    if (plain) {
      return { background: "transparent", padding: "4px", boxShadow: "none" };
    }
    if (bg) {
      return { background: bg };
    }
    return { background: "rgba(0,0,0,0.05)" };
  };

  return (
    <div className="ea-button-container" onClick={onClick}>
      <div className="ea-btn-base" style={getButtonStyle()}>
        <span className="ea-btn-icon">
          {/* Suporta tanto Strings (Emojis/SVG) quanto Elementos React */}
          {typeof currentIcon === "string" &&
          (currentIcon.includes("<svg") || currentIcon.includes("<img")) ? (
            <span dangerouslySetInnerHTML={{ __html: currentIcon }} />
          ) : (
            currentIcon
          )}
        </span>
        {currentText && <span className="ea-btn-text">{currentText}</span>}
      </div>
    </div>
  );
};

export default EAButton;
