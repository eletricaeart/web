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
          gap: .5rem;
          border-top: 1px solid #00889c;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
          z-index: 8000;
          transition: transform 0.3s ease;
        }
        .nav-item {
          display: flex;
          width: 70%;
          /* height: 80%;  */
          /* padding: 5px; */
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          color: #fff;
          font-size: 0.7rem;
          font-family: 'Poppins', sans-serif;
          text-transform: uppercase;
          gap: 4px;
          border-radius: 50rem !important;
        }
        .nav-item > content {
          display: grid;
          place-items: center;
          background: #ffab0000;
          width: 90%;
          height: 45px;
        }
        .nav-item.active {
          color: #ffab00;
          font-weight: bold;
          background-color: #fff3;
          border-radius: 50rem !important;
        }
        .nav-icon {
          font-size: 12px;
        }
        /* Classe para esconder quando o teclado abrir */
        .nav-hidden {
          transform: translateY(100%);
        }
      </style>
      <bottom-nav id="main-nav">
        <a href="${rootPrefix}index.html" class="nav-item ${currentPath === "index.html" || currentPath === "" ? "active" : ""}">
          <content>
          <span class="nav-icon">🏠</span>
          <!-- <span>Home</span> -->
          </content>
        </a>
        <a href="${prefix}clientes-lista.html" class="nav-item ${currentPath.includes("cliente") ? "active" : ""}">
          <content>
          <span class="nav-icon">👥</span>
          <!-- <span>Clientes</span> -->
          </content>
        </a>
        <a href="${prefix}dashboard.html" class="nav-item ${currentPath === "dashboard.html" || currentPath === "orcamento.html" ? "active" : ""}">
          <content>
          <span class="nav-icon">📄</span>
          <!-- <span>Orçamentos</span> -->
          </content>
        </a>
        <a href="${prefix}notes.html" class="nav-item ${currentPath.includes("note") ? "active" : ""}">
          <content>
          <span class="nav-icon">📝</span>
          <!-- <span>Notas</span> -->
          </content>
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
