import React, { useRef, useEffect } from "react";
import "./EANotionEditor.css";

const EANotionEditor = ({ value, onChange, placeholder }) => {
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const tx = textareaRef.current;
    if (tx) {
      tx.style.height = "auto";
      tx.style.height = tx.scrollHeight + "px";
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleKeyDown = (e) => {
    const tx = e.target;
    const text = tx.value;
    const pos = tx.selectionStart;
    const lineStart = text.lastIndexOf("\n", pos - 1) + 1;
    const currentLine = text.substring(lineStart, pos);

    // Enter Inteligente: Continua a lista ou destaque na próxima linha
    if (e.key === "Enter") {
      if (
        currentLine.startsWith("* ") ||
        currentLine.startsWith("- ") ||
        currentLine.startsWith("> ")
      ) {
        if (currentLine.trim().length <= 2) return; // Se vazio, sai do bloco

        e.preventDefault();
        const prefix = currentLine.substring(0, 2);
        const newValue =
          text.substring(0, pos) + "\n" + prefix + text.substring(pos);
        onChange(newValue);

        // Ajusta cursor após o render
        setTimeout(() => {
          tx.selectionStart = tx.selectionEnd = pos + 3;
        }, 0);
      }
    }
  };

  return (
    <div className="ea-notion-editor">
      <textarea
        ref={textareaRef}
        className="ea-notion-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Escreva aqui..."}
        rows="1"
      />
    </div>
  );
};

export default EANotionEditor;
