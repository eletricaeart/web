class EAModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  // Função estática para disparar o modal globalmente
  static async confirm(title, message, type = "confirm") {
    return new Promise((resolve) => {
      const modal = document.createElement("ea-modal");
      document.body.appendChild(modal);

      modal.open(title, message, type, (result) => {
        resolve(result);
        modal.remove();
      });
    });
  }

  static alert(title, message) {
    this.confirm(title, message, "alert");
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.6); display: none;
          align-items: center; justify-content: center; z-index: 10000;
          backdrop-filter: blur(4px); transition: opacity 0.3s ease;
        }
        .overlay.active { display: flex; opacity: 1; }
        .modal {
          background: white; width: 90%; max-width: 400px;
          border-radius: 16px; overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          transform: translateY(20px); transition: transform 0.3s ease;
        }
        .modal > ui {
          display: block;
          background: var( --sv-sombra-azul );
          margin: 0;
          padding: 0;
        }
        .modal > ui > content {
          display: block;
          margin: 0;
          padding: 0;
          background: #fff;
          border-radius: 1rem;
        }
        .active .modal { transform: translateY(0); }
        .header { 
          padding: .5rem; background: var(--sv-sombra-azul, #154a8f); 
          color: white; font-family: 'Montserrat', sans-serif; font-weight: bold;
        }
        .header > text {
          display: block !important;
          background: var( --sv-sodalita );
          height: 100%;
          padding: .6rem;
          text-align: center;
          border-radius: 1rem;
        }
        .body { 
          padding: 20px; color: #444; font-family: 'Poppins', sans-serif; line-height: 1.5;
        }
        .footer { 
          padding: 15px; display: flex; gap: 10px; justify-content: space-between;
          background: #f9f9f9;
        }
        button {
          padding: 10px 20px; border-radius: 8px; border: none;
          font-weight: bold; cursor: pointer; font-family: inherit;
          flex: 1;
        }
        .btn-cancel { background: #eee; color: #666; }
        .btn-confirm { background: var(--sv-sombra-azul, #154a8f); color: white; }
        .btn-danger { background: #ff4444; color: white; }
      </style>
      <div id="overlay" class="overlay">
        <div class="modal">
          <ui>
            <header class="header" id="">
              <text id="title"></text>
            </header>
            <content>
              <div class="body" id="message"></div>
              <div class="footer" id="footer"></div>
            </content>
          </ui>
        </div>
      </div>
    `;
  }

  open(title, message, type, callback) {
    const overlay = this.shadowRoot.getElementById("overlay");
    this.shadowRoot.getElementById("title").innerText = title;
    // this.shadowRoot.getElementById("message").innerText = message;
    this.shadowRoot.getElementById("message").innerHTML = message;
    const footer = this.shadowRoot.getElementById("footer");

    footer.innerHTML = ""; // Limpa botões

    if (type === "confirm" || type === "danger") {
      const btnCancel = document.createElement("button");
      btnCancel.className = "btn-cancel";
      btnCancel.innerText = "CANCELAR";
      btnCancel.onclick = () => {
        overlay.classList.remove("active");
        callback(false);
      };
      footer.appendChild(btnCancel);
    }

    const btnConfirm = document.createElement("button");
    btnConfirm.className = type === "danger" ? "btn-danger" : "btn-confirm";
    btnConfirm.innerText = type === "alert" ? "ENTENDI" : "CONFIRMAR";
    btnConfirm.onclick = () => {
      overlay.classList.remove("active");
      callback(true);
    };
    footer.appendChild(btnConfirm);

    setTimeout(() => overlay.classList.add("active"), 10);
  }
}
window.customElements.define("ea-modal", EAModal);
