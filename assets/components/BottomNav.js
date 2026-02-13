class BottomNav extends HTMLElement {
  connectedCallback() {
    this.render();
    this.handleKeyboard();
  }

  render() {
    this.innerHTML = `
      <nav class="bottom-nav">
        <style>
        .bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  height: 60px;
  background: #fff;
  border-top: 1px solid #ddd;

  display: flex;
  justify-content: space-around;
  align-items: center;

  z-index: 9999;
}

.bottom-nav button {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  font-size: 12px;
}

        </style>
        <button data-route="/dashboard">🏠<span>Home</span></button>
        <button data-route="/clientes">👥<span>Clientes</span></button>
        <button data-route="/orcamentos">📄<span>Orçamentos</span></button>
        <button data-route="/notas">📝<span>Notas</span></button>
      </nav>
    `;

    this.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.location.href = btn.dataset.route;
      });
    });
  }

  handleKeyboard() {
    if (!window.visualViewport) return;

    const nav = () => this.querySelector(".bottom-nav");

    const baseHeight = window.visualViewport.height;

    window.visualViewport.addEventListener("resize", () => {
      const diff = baseHeight - window.visualViewport.height;

      if (diff > 150) {
        nav().style.display = "none"; // teclado aberto
      } else {
        nav().style.display = "flex"; // teclado fechado
      }
    });
  }
}

customElements.define("bottom-nav", BottomNav);
