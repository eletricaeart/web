const backButtonStyle = `
<style>
    back-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        cursor: pointer;
        transition: background 0.3s;
    }
    back-btn:active {
        background: rgba(255, 255, 255, 0.2);
    }
    back-btn > ui {
      background: #fff0;
      height: 60%;
      aspect-ratio: 1;
      display: grid;
      place-items: center;
      border-radius: .8rem;
    }
    .arrow-back {
        width: 24px;
        height: 24px;
        fill: white;
      fill: #ffab00;
    }
</style>
`;

function initBackButton(target = "header-area") {
  const parent = document.querySelector(target);
  if (!parent) return;

  document.head.insertAdjacentHTML("beforeend", backButtonStyle);

  const btnHtml = `
    <back-btn id="btn_global_back" title="Voltar">
      <ui>
        <svg class="arrow-back" viewBox="0 0 24 24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </ui>
    </back-btn>
  `;

  parent.innerHTML = btnHtml;

  document.getElementById("btn_global_back").on("click", (e) => {
    const drawer = document.getElementById("drawer_menu");

    // 1. Se o menu lateral estiver aberto, apenas fecha ele
    if (drawer && drawer.classList.contains("active")) {
      document.getElementById("openMenu").click();
      return;
    }

    // 2. LISTA DE TELAS PROIBIDAS (Telas de edição/captura)
    const forbiddenPages = ["captura.html", "new-note.html"];

    // 3. LÓGICA DE VOLTA INTELIGENTE
    const referrer = document.referrer;
    const isEditingClient =
      window.location.pathname.includes("cliente.html") &&
      (window.isEditing ||
        document.getElementById("edit_mode_basics")?.style.display === "block");

    // Se viemos de uma página proibida OU estamos saindo de uma edição de cliente
    const shouldRedirectDirectly =
      forbiddenPages.some((page) => referrer.includes(page)) || isEditingClient;

    if (shouldRedirectDirectly) {
      // Mapeamento de destino seguro
      const currentPath = window.location.pathname;
      let targetPage = "index.html";

      if (
        currentPath.includes("orcamento.html") ||
        currentPath.includes("captura.html")
      ) {
        targetPage = "dashboard.html";
      } else if (
        currentPath.includes("notes.html") ||
        currentPath.includes("new-note.html")
      ) {
        targetPage = "notes.html";
      } else if (
        currentPath.includes("cliente.html") ||
        currentPath.includes("clientes-lista.html")
      ) {
        targetPage = "clientes-lista.html";
      }

      // Executa o redirecionamento para a página "mãe" (Safe Page)
      const isRoot = !window.location.pathname.includes("/pages/");
      window.location.href = isRoot
        ? `./pages/${targetPage}`
        : `./${targetPage}`;
    } else if (document.referrer.indexOf(window.location.host) !== -1) {
      // Se a página anterior for segura, usa o comportamento padrão de voltar
      window.history.back();
    } else {
      // Se não houver histórico interno, vai para a home
      const isRoot = !window.location.pathname.includes("/pages/");
      window.location.href = isRoot ? "./index.html" : "../index.html";
    }
  });
}
