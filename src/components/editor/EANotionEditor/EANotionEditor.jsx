import React, { useState, useEffect, useRef } from "react";
import styles from "./EANotionEditor.module.css";

const EANotionEditor = ({
  value,
  onChange,
  placeholder = "Digite aqui...",
  bg,
  radius,
}) => {
  const [text, setText] = useState(value || "");
  const textareaRef = useRef(null);

  useEffect(() => {
    setText(value || "");
    adjustHeight();
  }, [value]);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const processTextToHtml = (rawText) => {
    if (!rawText) return "";
    let lines = rawText.split("\n");
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
          htmlResult.push(`<div class="${styles.tagcBlock}">`);
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
        htmlResult.push(
          `<li class="${styles.listItem}">${line.substring(2)}</li>`,
        );
      } else {
        if (inTagC) {
          htmlResult.push(`</div>`);
          inTagC = false;
        }
        if (inUl) {
          htmlResult.push(`</ul>`);
          inUl = false;
        }

        if (tl.startsWith("# ")) {
          htmlResult.push(
            `<div class="${styles.editorH3}">${line.substring(2)}</div>`,
          );
        } else if (tl === "---") {
          htmlResult.push(`<hr class="${styles.editorHr}">`);
        } else {
          htmlResult.push(`<div>${line || "&nbsp;"}</div>`);
        }
      }
    });

    if (inTagC) htmlResult.push(`</div>`);
    if (inUl) htmlResult.push(`</ul>`);
    return htmlResult.join("");
  };

  const handleKeyDown = (e) => {
    const pos = e.target.selectionStart;
    const currentText = e.target.value;
    const lineStart = currentText.lastIndexOf("\n", pos - 1) + 1;
    const currentLine = currentText.substring(lineStart, pos);

    if (e.key === "Enter") {
      if (
        currentLine.startsWith("* ") ||
        currentLine.startsWith("- ") ||
        currentLine.startsWith("> ")
      ) {
        if (currentLine.trim().length <= 2) return;

        e.preventDefault();
        const prefix = currentLine.substring(0, 2);
        const newText =
          currentText.substring(0, pos) +
          "\n" +
          prefix +
          currentText.substring(pos);
        setText(newText);
        if (onChange) onChange(newText);

        setTimeout(() => {
          textareaRef.current.selectionStart =
            textareaRef.current.selectionEnd = pos + 3;
        }, 0);
      }
    }

    if (e.key === "Backspace" && pos === lineStart + 2) {
      if (
        currentLine.startsWith("* ") ||
        currentLine.startsWith("- ") ||
        currentLine.startsWith("> ")
      ) {
        e.preventDefault();
        const newText =
          currentText.substring(0, lineStart) + currentText.substring(pos);
        setText(newText);
        if (onChange) onChange(newText);
        setTimeout(() => {
          textareaRef.current.selectionStart =
            textareaRef.current.selectionEnd = lineStart;
        }, 0);
      }
    }
  };

  const handleInputChange = (e) => {
    const newVal = e.target.value;
    setText(newVal);
    adjustHeight();
    if (onChange) onChange(newVal);
  };

  return (
    <div
      className={styles.host}
      style={{ background: bg || "#fff0", borderRadius: radius || "0" }}
    >
      <div className={styles.container}>
        <div
          className={styles.notionPreview}
          dangerouslySetInnerHTML={{ __html: processTextToHtml(text) }}
        />
        <textarea
          ref={textareaRef}
          className={styles.notionTextarea}
          placeholder={placeholder}
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default EANotionEditor;
