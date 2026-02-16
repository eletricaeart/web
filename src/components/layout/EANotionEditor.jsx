import React, { useEffect, useRef } from "react";
import "./EANotionEditor.css";

// Exportamos a lógica de processamento para ser usada em qualquer lugar
export const processNotionText = (text) => {
  if (!text) return "";
  let lines = text.split("\n");
  let inTagC = false;
  let inUl = false;
  let htmlResult = [];

  lines.forEach((line) => {
    const tl = line.trim();

    if (tl.startsWith("> ")) {
      if (inUl) {
        htmlResult.push(`</ul>`);
        inUl = false;
      }
      if (!inTagC) {
        htmlResult.push(`<div class="tagc-block">`);
        inTagC = true;
      }
      htmlResult.push(`<div>${line.substring(2)}</div>`);
    } else if (tl.startsWith("- ") || tl.startsWith("* ")) {
      if (inTagC) {
        htmlResult.push(`</div>`);
        inTagC = false;
      }
      if (!inUl) {
        htmlResult.push(`<ul>`);
        inUl = true;
      }
      htmlResult.push(`<li>${line.substring(2)}</li>`);
    } else {
      if (inTagC) {
        htmlResult.push(`</div>`);
        inTagC = false;
      }
      if (inUl) {
        htmlResult.push(`</ul>`);
        inUl = false;
      }
      htmlResult.push(tl === "" ? "<br>" : `<div>${line}</div>`);
    }
  });

  if (inTagC) htmlResult.push(`</div>`);
  if (inUl) htmlResult.push(`</ul>`);

  return htmlResult.join("");
};

const EANotionEditor = ({ value, onChange, placeholder }) => {
  const textareaRef = useRef(null);

  // Auto-ajuste de altura (Substitui o setTimeout(update) original)
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
    const { selectionStart: pos, value: text } = tx;
    const lineStart = text.lastIndexOf("\n", pos - 1) + 1;
    const currentLine = text.substring(lineStart, pos);

    // Enter Inteligente (Auto-continuação de listas e tags)
    if (e.key === "Enter") {
      if (
        currentLine.startsWith("* ") ||
        currentLine.startsWith("- ") ||
        currentLine.startsWith("> ")
      ) {
        if (currentLine.trim().length <= 2) return; // Sai do bloco se estiver vazio

        e.preventDefault();
        const prefix = currentLine.substring(0, 2);
        const newValue =
          text.substring(0, pos) + "\n" + prefix + text.substring(pos);
        onChange(newValue);

        // Ajusta cursor após o re-render
        setTimeout(() => {
          tx.selectionStart = tx.selectionEnd = pos + 3;
        }, 0);
      }
    }

    // Backspace Inteligente
    if (e.key === "Backspace" && pos === lineStart + 2) {
      if (
        currentLine.startsWith("* ") ||
        currentLine.startsWith("- ") ||
        currentLine.startsWith("> ")
      ) {
        e.preventDefault();
        const newValue = text.substring(0, lineStart) + text.substring(pos);
        onChange(newValue);

        setTimeout(() => {
          tx.selectionStart = tx.selectionEnd = lineStart;
        }, 0);
      }
    }
  };

  return (
    <div className="ea-notion-container">
      <textarea
        ref={textareaRef}
        className="ea-notion-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows="1"
      />
    </div>
  );
};

export default EANotionEditor;
