import React from "react";
import "./style.css";
import View from "../../layout/View";

export default function Btn({
  label = "Clique aqui", // Fallback de texto
  labelPressed, // Texto opcional ao pressionar
  icon = null, // Ícone (pode ser emoji ou componente)
  showIcon = true, // Opção de não ter ícone
  bg = "#007bff", // Cor de fundo padrão
  iconColor = "#fff", // Cor do ícone
  textColor = "#fff", // Cor do texto
  width = "auto", // Largura customizável
  textSize = "1rem", // Tamanho do texto
  action, // Função ao clicar
  ...props
}) {
  const [isPressed, setIsPressed] = useState(false);
  const buttonStyle = {
    cursor: "pointer",
    border: "none",
    borderRadius: "8px",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.2s ease",
    width: width,
    fontSize: textSize,
    color: textColor,
    padding: "10px 20px",
    boxShadow: isPressed ? "none" : "0 4px 6px rgba(0,0,0,0.1)",
    transform: isPressed ? "scale(0.95)" : "scale(1)",
    ...props.style,
  };

  return (
    <>
      <View
        tag="btn"
        flex
        bg={bg}
        style={buttonStyle}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onClick={action}
        {...props}
      >
        <button class="btn-back-home">
          {showIcon && icon && (
            <span style={{ color: iconColor, display: "flex" }}>{icon}</span>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M222.14,105.85l-80-80a20,20,0,0,0-28.28,0l-80,80A19.86,19.86,0,0,0,28,120v96a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V164h24v52a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V120A19.86,19.86,0,0,0,222.14,105.85ZM204,204H164V152a12,12,0,0,0-12-12H104a12,12,0,0,0-12,12v52H52V121.65l76-76,76,76Z"></path>
          </svg>
          {isPressed && labelPressed ? labelPressed : label}
          <span className="btn-text">VOLTAR PARA O INÍCIO</span>
        </button>
      </View>
    </>
  );
}
