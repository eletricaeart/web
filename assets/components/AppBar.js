function initAppBar() {
  const body = document.body;

  // Detecta se estamos na raiz (index.html) ou em uma pasta (pages/)
  const isRoot = !window.location.pathname.includes("/pages/");
  const prefix = isRoot ? "./pages/" : "./";
  const rootPrefix = isRoot ? "./" : "../";

  const appbarLinks = [
    { name: "🏠 Home", url: `${rootPrefix}index.html` },
    { name: "📊 Dashboard", url: `${prefix}dashboard.html` },
    { name: "✍️ Novo Orçamento", url: `${prefix}captura.html` },

    { name: "📊 Notas", url: `${prefix}notas.html` },
    // { name: "📊 dashboard paged", url: `${prefix}dashboardpaged.html` },
    /*{ name: "📊 teste 3", url: "#" },*/
  ];

  const logoText = `
    <ea-text 
      font="GodOfThunder" 
      size="1.4rem"
      shadow-stroke="5px"
      color="#ffffff"
      shadow="var( --sv-sodalita  )"
    >${"eletrica "}</ea-text>
    <ea-text 
      font="GodOfThunder" 
      size=".8rem"
      shadow-stroke="5px"
      color="#ffab00"
      shadow="var( --sv-sodalita  )"
    >${"&nbsp;"}</ea-text>
    <ea-text 
      font="GodOfThunder" 
      size="1.4rem"
      shadow-stroke="5px"
      color="#ffab00"
      shadow="var( --sv-sodalita  )"
    >${"&"}</ea-text>
    <ea-text 
      font="GodOfThunder" 
      size=".8rem"
      shadow-stroke="5px"
      color="#ffab00"
      shadow="var( --sv-sodalita  )"
    >${"&nbsp;"}</ea-text>
    <ea-text 
      font="GodOfThunder" 
      size="1.4rem"
      shadow-stroke="5px"
      color="#ffffff"
      shadow="var( --sv-sodalita  )"
    >${" art"}</ea-text>
  `;

  const appBarTemplate = `
<style>
  /*appbar {
    display: flex; flex-direction: row; width: 100%; height: 72px;
    flex-shrink: 0 !important;
    background: var(--card-lv1); box-shadow: var(--appbar-shadow);
    position: sticky; top: 0; z-index: 9000;
  }*/
appbar {
    display: flex !important;
    flex-direction: row !important;
    width: 100% !important;
    height: 72px !important;
    min-height: 72px !important;
    flex-shrink: 0 !important;
    background: var(--card-lv1);
    box-shadow: var(--appbar-shadow);
    position: sticky; 
    top: 0;
    left: 0;
    z-index: 9000; 
    box-sizing: border-box;
}
  appbar > ui { display: flex; flex-direction: row; width: 100%; height: 100%; }
  appbar title-area { background: transparent; flex: 1; display: flex; align-items: center; justify-content: center; padding: 0 15px; }
  ::slotted([slot="title"]) { background: transparent; flex: 1; display: flex; align-items: center; justify-content: center; padding: 0 15px; }
  [slot="title"] { background: transparent; flex: 1; display: flex; flex-flow: row; align-items: center; justify-content: center; padding: 0 15px; }
  navigation-slot { 
    background-color: #ffab0000; 
    height: 100%; aspect-ratio: 1;
    display: flex; align-items: center; justify-content: center; 
    cursor: pointer; 
  }
  actions-slot { 
    background: #905; 
    background: #cbdcf700;
    height: 100%; aspect-ratio: 1; 
    display: flex; align-items: center; justify-content: center; 
    cursor: pointer; color: white; font-size: 1.5rem;
  }

  /* Drawer Menu */
  #drawer_menu {
    position: fixed;
    top: 72px; left: 0; 
    width: 100%; height: 100%;        
    background: rgba(0, 0, 0, 0.85);
    background: linear-gradient(45deg, #e5e5e5, #fff);
    backdrop-filter: blur(8px);
    display: none; /* Controlado pelo JS */
    z-index: 6000;
    flex-direction: column;
    align-items: center;
    /* justify-content: center; */
    overflow: hidden;
  }

  /* Delays para o efeito cascata (entrada) */
  #drawer_menu.active > a:nth-child(1) { transition-delay: 0.1s; }
  #drawer_menu.active > a:nth-child(2) { transition-delay: 0.15s; }
  #drawer_menu.active > a:nth-child(3) { transition-delay: 0.2s; }
  #drawer_menu.active > a:nth-child(4) { transition-delay: 0.25s; }
  #drawer_menu.active > a:nth-child(5) { transition-delay: 0.3s; }
  #drawer_menu.active > a:nth-child(6) { transition-delay: 0.35s; }

  .btn-close-drawer {
    margin-top: 50px;
    background: transparent;
    color: white;
    border: 2px solid #ffcc00;
    padding: 12px 35px;
    border-radius: 5px;
    font-family: 'Montserrat';
    font-weight: 800;
    text-transform: uppercase;
    cursor: pointer;
    transition: 0.3s;
    opacity: 0;
  }
  #drawer_menu.active .btn-close-drawer { opacity: 1; transition-delay: 0.7s; }
  #drawer_menu > a {
    width: calc( 100% - 5px );
    height: 120px;
    margin: 0px 0;
    display: grid;
    place-items: center;
    font-size: 1.4rem;
    text-decoration: none;
    font-weight: 700;
    font-family: 'Poppins', sans-serif;
    color: white;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    opacity: 0;
    position: relative;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* Estilo "Lâmina" Esquerda (Azul Elétrico) */
  #drawer_menu > a:nth-child(even) {
    place-self: start;
    background: linear-gradient(90deg, #27f3 0%, #27f1 100%);
/*    clip-path: polygon(0 0, 90% 0, 100% 50%, 100% 100%, 0 100%); */
    transform: translateX(-110%);
    color: #1a1a1a;
    border-left: 5px solid #27f; /* "Faísca" lateral */
    box-shadow: 10px 0 20px rgba(34, 119, 255, 0.3);
  }

  /* Estilo "Lâmina" Direita (Cobre/Âmbar) */
  #drawer_menu > a:nth-child(odd) {
    place-self: end;
    background: linear-gradient(270deg, #ffab0030 0%, #ffab0010 100%);
    /* clip-path: polygon(0% 0, 100% 0, 100% 100%, 10% 100%, 0 50%); */
    transform: translateX(110%);
    color: #1a1a1a;
    border-right: 5px solid #ffcc00;
    box-shadow: -10px 0 20px rgba(255, 171, 0, 0.3);
  }

  /* Efeito de Vidro/Profundidade Interna */
  #drawer_menu > a::before {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(rgba(255,255,255,0.15), transparent);
    pointer-events: none;
  }

  /* Hover Artístico */
  #drawer_menu > a:hover {
    width: 85%;
    filter: brightness(1.2) saturate(1.2);
    letter-spacing: 3px;
    text-shadow: 0 0 10px rgba(255,255,255,0.5);
  }

  /* Animação Ativa */
  #drawer_menu.active > a {
    transform: translateX(0);
    opacity: 1;
  }

  
</style>

<appbar class="no-print">
  <ui>
    <navigation-slot id="appbar_back_zone">
    </navigation-slot>
    <main slot="title">
      ${logoText}
    </main>
    <actions-slot id="openMenu">
      <div id="menu_icon_wrapper" style="transition: transform 0.4s ease; display: grid; place-items: center;">
        ☰
      </div>
    </actions-slot>
  </ui>
</appbar>

<div id="drawer_menu">
${appbarLinks
  .map((l) => `<a href="${l.url}" class="menu-block">${l.name}</a>`)
  .join("")}
</div>
`;

  body.insertAdjacentHTML("afterbegin", appBarTemplate);
  // INICIALIZA O BOTÃO DE VOLTAR NO ESPAÇO RESERVADO
  if (typeof initBackButton === "function") {
    initBackButton("#appbar_back_zone");
  }

  const drawer = document.getElementById("drawer_menu");
  const btnOpen = document.getElementById("openMenu");
  const iconWrapper = document.getElementById("menu_icon_wrapper");

  const openDrawer = () => {
    drawer.style.display = "flex";

    // Gira e troca o ícone
    iconWrapper.style.transform = "rotate(180deg)"; // Gira meia volta
    setTimeout(() => {
      iconWrapper.innerHTML = "✕"; // Troca no meio da animação
    }, 150);

    // btnOpen.innerHTML = "✕"; // Troca ☰ por ✕
    // Pequeno timeout para o navegador processar o display:flex antes da animação
    setTimeout(() => {
      drawer.classList.add("active");
    }, 10);
  };

  const closeDrawer = () => {
    drawer.classList.remove("active");

    // Volta o giro e o ícone
    iconWrapper.style.transform = "rotate(0deg)";
    setTimeout(() => {
      iconWrapper.innerHTML = "☰";
    }, 150);

    // btnOpen.innerHTML = "☰"; // Volta para o ícone original

    // Espera a animação de saída terminar (0.6s do último item + 0.4s de transição)
    setTimeout(() => {
      drawer.style.display = "none";
    }, 800);
  };

  // btnOpen.on("click", openDrawer);
  // btnClose.on("click", closeDrawer);
  // Lógica de Toggle (Alternância)
  btnOpen.on("click", () => {
    if (drawer.classList.contains("active")) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  // O BackButton também deve fechar o menu se estiver aberto
  const backBtn = document.getElementById("btn_global_back");
  if (backBtn) {
    backBtn.on("click", (e) => {
      if (drawer.classList.contains("active")) {
        e.stopImmediatePropagation(); // Impede que o navegador volte a página
        closeDrawer();
      }
    });
  }

  // Fecha ao clicar em qualquer link dentro do menu
  const links = drawer.querySelectorAll("a");
  links.forEach((link) => {
    link.on("click", closeDrawer);
  });

  // Garante que o clique no fundo escuro feche o menu
  drawer.on("click", (e) => {
    // Se o clique foi no container e não em um link <a>
    if (e.target === drawer) {
      closeDrawer();
    }
  });
}

initAppBar();
