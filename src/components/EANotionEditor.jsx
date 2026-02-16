import React, { useRef, useEffect } from "react";
import "./EANotionEditor.css";

/**
 * Função utilitária para converter o Markdown customizado em HTML.
 * Exportada para ser usada na visualização do orçamento (OrcamentoView).
 */
/* export function processTextToHtml(text) {
  if (!text) return "";
  let lines = text.split("\n");
  let inTagC = false;
  let inUl = false;
  let htmlResult = [];

  lines.forEach((line) => {
    const tl = line.trim();

    // Lógica de Destaque (Bloco Azul)
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
    }
    // Lógica de Lista (Bolinhas)
    else if (tl.startsWith("- ") || tl.startsWith("* ")) {
      if (inTagC) {
        htmlResult.push(`</div>`);
        inTagC = false;
      }
      if (!inUl) {
        htmlResult.push(`<ul>`);
        inUl = true;
      }
      htmlResult.push(`<li>${line.substring(2)}</li>`);
    }
    // Outros elementos (Títulos, Quebras e Texto Simples)
    else {
      if (inTagC) {
        htmlResult.push(`</div>`);
        inTagC = false;
      }
      if (inUl) {
        htmlResult.push(`</ul>`);
        inUl = false;
      }

      if (tl.startsWith("# ")) {
        htmlResult.push(`<div class="editor-h3">${line.substring(2)}</div>`);
      } else if (tl === "---") {
        htmlResult.push(`<hr class="editor-hr">`);
      } else {
        htmlResult.push(`<div>${line || "&nbsp;"}</div>`);
      }
    }
  });

  if (inTagC) htmlResult.push(`</div>`);
  if (inUl) htmlResult.push(`</ul>`);

  return htmlResult.join("");
} */

export default function EANotionEditor({ value, onChange, placeholder }) {
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
        if (currentLine.trim().length <= 2) return;

        e.preventDefault();
        const prefix = currentLine.substring(0, 2);
        const newValue =
          text.substring(0, pos) + "\n" + prefix + text.substring(pos);
        onChange(newValue);

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
}
