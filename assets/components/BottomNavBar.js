class BottomNavBar extends HTMLElement {
  connectedCallback() {
    this.render();
    this.handleKeyboard();
  }

  render() {
    const isRoot = !window.location.pathname.includes("/pages/");
    const prefix = isRoot ? "./pages/" : "./";
    const rootPrefix = isRoot ? "./" : "../";

    const currentPath = window.location.pathname.split("/").pop();

    this.innerHTML = `
      <style>
        bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 65px;
          background: white;
          background: #00559c;
          display: flex;
          justify-content: space-around;
          align-items: center;
          border-top: 1px solid #eee;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
          z-index: 8000;
          transition: transform 0.3s ease;
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          color: #fff;
          font-size: 0.7rem;
          font-family: 'Poppins', sans-serif;
          gap: 4px;
        }
        .nav-item.active {
          color: #ffab00;
          font-weight: bold;
        }
        .nav-icon {
          font-size: 1.4rem;
        }
        /* Classe para esconder quando o teclado abrir */
        .nav-hidden {
          transform: translateY(100%);
        }
      </style>
      <bottom-nav id="main-nav">
        <a href="${rootPrefix}index.html" class="nav-item ${currentPath === "index.html" || currentPath === "" ? "active" : ""}">
          <span class="nav-icon">🏠</span>
          <span>Home</span>
        </a>
        <a href="${prefix}clientes-lista.html" class="nav-item ${currentPath.includes("cliente") ? "active" : ""}">
          <span class="nav-icon">👥</span>
          <span>Clientes</span>
        </a>
        <a href="${prefix}dashboard.html" class="nav-item ${currentPath === "dashboard.html" || currentPath === "orcamento.html" ? "active" : ""}">
          <span class="nav-icon">📊</span>
          <span>Orçamentos</span>
        </a>
        <a href="${prefix}notes.html" class="nav-item ${currentPath.includes("note") ? "active" : ""}">
          <span class="nav-icon">📝</span>
          <span>Notas</span>
        </a>
      </bottom-nav>
    `;
  }

  handleKeyboard() {
    // Detecta mudança de tamanho da tela para esconder o menu no celular (teclado aberto)
    const nav = this.querySelector("bottom-nav");
    const initialHeight = window.innerHeight;

    window.addEventListener("resize", () => {
      if (window.innerHeight < initialHeight * 0.8) {
        nav.classList.add("nav-hidden");
      } else {
        nav.classList.remove("nav-hidden");
      }
    });
  }
}

customElements.define("ea-navbar", BottomNavBar);
