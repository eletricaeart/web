class EAButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._active = false;
  }

  static get observedAttributes() {
    return ["icon1", "icon2", "text1", "text2"];
  }

  connectedCallback() {
    this._active = this.hasAttribute("active");
    this.render();
  }

  toggle() {
    this._active = !this._active;
    this.render();
    return this._active;
  }

  render() {
    const icon1 = this.getAttribute("icon1") || "🔘";
    const icon2 = this.getAttribute("icon2") || icon1;
    const text1 = this.getAttribute("text1") || "";
    const text2 = this.getAttribute("text2") || text1;

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-block; cursor: pointer; user-select: none; }
        .btn {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 12px; border-radius: 20px;
          background: rgba(0,0,0,0.05); transition: 0.2s;
          font-family: 'Poppins', sans-serif; font-size: 0.8rem; font-weight: 600;
        }
        .btn:active { transform: scale(0.95); background: rgba(0,0,0,0.1); }
        .icon { font-size: 1.2rem; }
      </style>
      <div class="btn">
        <span class="icon">${this._active ? icon2 : icon1}</span>
        ${text1 || text2 ? `<span>${this._active ? text2 : text1}</span>` : ""}
      </div>
    `;
  }
}
customElements.define("ea-icon-button", EAButton);
