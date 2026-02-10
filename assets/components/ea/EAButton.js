class EAButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._active = false;
  }

  static get observedAttributes() {
    // Adicionamos 'bg' (cor de fundo) e 'plain' (sem fundo)
    return ["icon1", "icon2", "text1", "text2", "bg", "plain"];
  }

  connectedCallback() {
    this._active = this.hasAttribute("active");
    this.render();
  }

  // Permite atualizar a interface se os atributos mudarem dinamicamente
  attributeChangedCallback() {
    this.render();
  }

  toggle() {
    this._active = !this._active;
    this.render();
    return this._active;
  }

  render() {
    const icon1 = this.getAttribute("icon1") || "";
    const icon2 = this.getAttribute("icon2") || icon1;
    const text1 = this.getAttribute("text1") || "";
    const text2 = this.getAttribute("text2") || text1;
    const bgColor = this.getAttribute("bg");
    const isPlain = this.hasAttribute("plain");

    const currentIcon = this._active ? icon2 : icon1;

    // Lógica de estilo dinâmico
    let btnStyle = "";
    if (isPlain) {
      // Se for 'plain', removemos fundo e sombras
      btnStyle = "background: transparent; padding: 4px; box-shadow: none;";
    } else if (bgColor) {
      // Se tiver 'bg', aplicamos a cor
      btnStyle = `background: ${bgColor};`;
    } else {
      // Fundo padrão caso não seja plain nem tenha cor definida
      btnStyle = "background: rgba(0,0,0,0.05);";
    }

    this.shadowRoot.innerHTML = `
    <style>
      :host { display: inline-block; cursor: pointer; user-select: none; vertical-align: middle; }
      .btn {
        display: flex; align-items: center; justify-content: center;
        padding: 8px; border-radius: 12px;
        transition: 0.2s;
        min-width: 40px; height: 40px;
        box-sizing: border-box;
        ${btnStyle} /* Injeção do estilo dinâmico */
      }
      .btn:active { transform: scale(0.92); filter: brightness(0.9); }
      
      .icon { 
        width: 24px; height: 24px; 
        display: flex; align-items: center; justify-content: center; 
      }
      .icon svg { width: 100%; height: 100%; fill: currentColor; }
      .icon img { width: 100%; height: 100%; object-fit: contain; display: block; }
      
      .text { font-family: 'Poppins', sans-serif; font-size: 0.9rem; font-weight: 500; }
    </style>
    <div class="btn">
      <span class="icon">${currentIcon}</span>
      ${(this._active ? text2 : text1) ? `<span class="text" style="margin-left:8px">${this._active ? text2 : text1}</span>` : ""}
    </div>
  `;
  }
}
customElements.define("ea-icon-button", EAButton);
