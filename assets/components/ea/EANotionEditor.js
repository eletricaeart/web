class EANotionEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.initLogic();
  }

  // Lógica centralizada de conversão (Markdown -> HTML)
  static processText(text) {
    if (!text) return "";
    let lines = text.split("\n");
    let inTagC = false;
    let htmlResult = [];

    lines.forEach((line) => {
      const tl = line.trim();

      if (tl.startsWith("> ")) {
        if (!inTagC) {
          htmlResult.push(`<div class="tagc-block">`);
          inTagC = true;
        }
        htmlResult.push(`<div>${line.substring(2)}</div>`);
      } else if (
        inTagC &&
        tl !== "" &&
        !tl.startsWith("* ") &&
        !tl.startsWith("- ") &&
        !tl.startsWith("# ")
      ) {
        htmlResult.push(`<div>${line}</div>`);
      } else {
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
            .container { 
                position: relative; width: 100%; min-height: 120px; 
                background: transparent; display: grid; 
            }
            .notion-textarea, .notion-preview {
                grid-area: 1 / 1 / 2 / 2;
                padding: 15px; font-family: 'Poppins', sans-serif;
                font-size: 14px; line-height: 1.6; width: 100%;
                min-height: 120px; box-sizing: border-box;
                white-space: pre-wrap; word-wrap: break-word;
                margin: 0; border: none; outline: none;
            }
            .notion-textarea {
                background: transparent !important; color: #333;
                caret-color: #ffab00; z-index: 2; resize: none; overflow: hidden;
            }
            .notion-preview { color: transparent; z-index: 1; pointer-events: none; }
            
            /* Estilos do Preview (Internos do Shadow DOM) */
            .tagc-block { 
                display: block; padding: 1em; background: rgba(34, 119, 255, 0.1); 
                color: #0075bd; font-weight: 500; border-radius: 12px; 
                border-left: 5px solid #27f; margin: 10px 0; 
            }
            li { color: #555; margin-left: 20px; }
            .editor-h3 { color: #154a8f; margin: 10px 0; }
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

    // Lógica de Enter e Backspace Inteligente
    tx.addEventListener("keydown", (e) => {
      const pos = tx.selectionStart;
      const text = tx.value;
      const lineStart = text.lastIndexOf("\n", pos - 1) + 1;
      const currentLine = text.substring(lineStart, pos);

      if (e.key === "Enter") {
        if (currentLine.startsWith("* ") || currentLine.startsWith("- ")) {
          const prefix = currentLine.substring(0, 2);
          if (currentLine.trim().length <= 2) return;
          e.preventDefault();
          tx.value =
            text.substring(0, pos) + "\n" + prefix + text.substring(pos);
          tx.selectionStart = tx.selectionEnd = pos + 3;
          update();
        }
      }

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

    // Inicializa altura e preview se já houver texto (edição)
    setTimeout(update, 10);
  }

  // Getter para facilitar a captura dos dados ao salvar
  get value() {
    return this.shadowRoot.getElementById("input").value;
  }

  set value(val) {
    this.shadowRoot.getElementById("input").value = val;
    this.shadowRoot.getElementById("input").dispatchEvent(new Event("input"));
  }
}
window.customElements.define("ea-editor", EANotionEditor);
