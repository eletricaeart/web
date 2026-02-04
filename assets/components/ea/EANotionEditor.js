class EANotionEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["value", "placeholder"];
  }

  connectedCallback() {
    this.render();
    this.initLogic();
  }

  // A MÁGICA: Função única que serve para EDITAR e VISUALIZAR
  static processText(text) {
    if (!text) return "";
    let lines = text.split("\n");
    let inTagC = false;
    let htmlResult = [];

    lines.forEach((line) => {
      const tl = line.trim();

      // Início ou continuação de um bloco de destaque
      if (tl.startsWith("> ")) {
        if (!inTagC) {
          htmlResult.push(`<div class="tagc-block">`);
          inTagC = true;
        }
        htmlResult.push(`<div>${line.substring(2)}</div>`);
      }
      // Se a linha anterior era > e a atual é texto comum (dentro do bloco)
      else if (
        inTagC &&
        tl !== "" &&
        !tl.startsWith("* ") &&
        !tl.startsWith("- ") &&
        !tl.startsWith("# ")
      ) {
        htmlResult.push(`<div>${line}</div>`);
      }
      // Quebra de bloco
      else {
        if (inTagC) {
          htmlResult.push(`</div>`);
          inTagC = false;
        }

        if (tl.startsWith("- ") || tl.startsWith("* ")) {
          htmlResult.push(`<li>${line.substring(2)}</li>`);
        } else if (tl.startsWith("# ")) {
          htmlResult.push(`<h3 class="editor-h3">${line.substring(2)}</h3>`);
        } else if (tl === "---") {
          htmlResult.push(`<hr class="editor-hr">`);
        } else {
          // Mantém quebras de linha visíveis
          htmlResult.push(`<div>${line || "&nbsp;"}</div>`);
        }
      }
    });

    if (inTagC) htmlResult.push(`</div>`);
    return htmlResult.join("");
  }

  render() {
    const placeholder = this.getAttribute("placeholder") || "Digite aqui...";
    const value = this.getAttribute("value") || "";

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; width: 100%; position: relative; }
        .container { position: relative; width: 100%; display: grid; }
        .notion-textarea, .notion-preview {
          grid-area: 1 / 1 / 2 / 2;
          padding: 15px; font-family: 'Poppins', sans-serif;
          font-size: 1rem; line-height: 1.6; width: 100%;
          min-height: 120px; box-sizing: border-box;
          white-space: pre-wrap; word-wrap: break-word;
          margin: 0; border: none; outline: none;
        }
        .notion-textarea {
          background: transparent !important; color: transparent;
          caret-color: #ffab00; z-index: 2; resize: none; overflow: hidden;
        }
        .notion-preview { color: #7a7a7a; z-index: 1; pointer-events: none; }
        
        /* Estilização interna idêntica ao seu design */
        .tagc-block {
          display: block; padding-left: 14px; background: rgba(34, 119, 255, 0.1);
          color: #0075bd; border-radius: 12px;
        }
        .tagc-block div {
          /*padding-left: 14px;*/
        }
        li { color: #777; margin-left: 12px; list-style: none; position: relative; font-weight: 500 !important; }
        li::before { content: "•"; position: absolute; left: -12px; color: red; }
        .editor-h3 { font-size: 1rem; color: #000; margin: 0; font-weight: 500; padding-left: 17px; }
        .editor-hr { border: 1px dashed #ccc; margin: 15px 0; }
      </style>
      <div class="container">
        <div id="preview" class="notion-preview"></div>
        <textarea id="input" class="notion-textarea" placeholder="${placeholder}">${value}</textarea>
      </div>
    `;
  }

  initLogic() {
    const tx = this.shadowRoot.getElementById("input");
    const pv = this.shadowRoot.getElementById("preview");

    const update = () => {
      pv.innerHTML = EANotionEditor.processText(tx.value);
      tx.style.height = "auto";
      tx.style.height = tx.scrollHeight + "px";
    };

    tx.addEventListener("input", update);

    tx.addEventListener("keydown", (e) => {
      const pos = tx.selectionStart;
      const text = tx.value;
      const lineStart = text.lastIndexOf("\n", pos - 1) + 1;
      const currentLine = text.substring(lineStart, pos);

      // Auto-continuação de Lista
      if (e.key === "Enter") {
        if (currentLine.startsWith("* ") || currentLine.startsWith("- ")) {
          if (currentLine.trim().length <= 2) return;
          e.preventDefault();
          const prefix = currentLine.substring(0, 2);
          tx.value =
            text.substring(0, pos) + "\n" + prefix + text.substring(pos);
          tx.selectionStart = tx.selectionEnd = pos + 3;
          update();
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
          tx.value = text.substring(0, lineStart) + text.substring(pos);
          tx.selectionStart = tx.selectionEnd = lineStart;
          update();
        }
      }
    });

    // Aguarda renderização para ajustar altura inicial
    setTimeout(update, 50);
  }

  // Métodos para facilitar o uso externo
  get value() {
    return this.shadowRoot.getElementById("input").value;
  }
  set value(val) {
    this.shadowRoot.getElementById("input").value = val;
    this.shadowRoot.getElementById("input").dispatchEvent(new Event("input"));
  }
}
window.customElements.define("ea-editor", EANotionEditor);
