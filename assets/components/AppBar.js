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

    { name: "📊 teste 1", url: "#" },
    { name: "📊 teste 2", url: "#" },
    { name: "📊 teste 3", url: "#" },
  ];

  const logoText = `${createThunderText({
    text: "Elétrica ",
    size: "1.3rem",
    color: "#003b6b", // Âmbar metálico
    strokeColor: "#fff", // Azul profundo da borda
    strokeWidth: "2px",
    tag: "t",
    dropShadow: "drop-shadow(0px 0px 3px #fff)",
  })} ${createThunderText({
    text: " & ",
    size: "2rem",
    color: "#fff", // Âmbar metálico
    strokeColor: "#ffab00", // Azul profundo da borda
    strokeWidth: "2px",
    tag: "t",
  })}
${createThunderText({
  text: " Art",
  size: "1.3rem",
  color: "#003b6b", // Âmbar metálico
  strokeColor: "#fff", // Azul profundo da borda
  strokeWidth: "2px",
  tag: "t",
})}
`;

  const appBarTemplate = `
<style>
    /* ... (Mantenha o estilo anterior da appbar) ... */
    appbar {
        display: flex; flex-direction: row; width: 100%; height: 72px;
        background: var(--card-lv1); box-shadow: var(--appbar-shadow);
        position: sticky; top: 0; z-index: 1000;
    }
    appbar > ui { display: flex; flex-direction: row; width: 100%; height: 100%; }
    appbar header-area { background-color: #ffab00; width: 20%; height: 100%; display: flex; align-items: center; justify-content: center; }
    appbar title-area { background: transparent; flex: 1; display: flex; align-items: center; justify-content: center; padding: 0 15px; }
    appbar options-btn { 
        background: #905; height: 100%; aspect-ratio: 1; 
        display: flex; align-items: center; justify-content: center; 
        cursor: pointer; color: white; font-size: 1.5rem;
    }

    /* Drawer Menu */
    #drawer_menu {
        position: fixed;
        top: 72px; left: 0; 
        padding-top: 1rem;
        width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.85);
        background: linear-gradient(45deg, #e5e5e5, #fff);
        backdrop-filter: blur(8px);
        display: none; /* Controlado pelo JS */
        z-index: 900;
        flex-direction: column;
        align-items: center;
        /* justify-content: center; */
        overflow: hidden;
    }

    #drawer_menu > a {
        height: 120px;
        display: grid;
        place-items: center;
        font-size: 1.5rem;
        text-decoration: none;
        font-weight: bold;
        color: white;
        font-family: 'Poppins', sans-serif;
        transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s;
        opacity: 0; /* Começa invisível */
    }

    /* Botões na Esquerda (Pares no seu código são os even) */
    #drawer_menu > a:nth-child(even) {
        background: #27f;
        width: 60%;
        place-self: start;
        clip-path: polygon(0 0, 85% 0, 100% 100%, 0 100%);
        transform: translateX(-110%); /* Fora da tela pela esquerda */
    }

    /* Botões na Direita (Ímpares) */
    #drawer_menu > a:nth-child(odd) {
        background: #ffab00;
        width: 60%;
        place-self: end;
        clip-path: polygon(15% 0, 100% 0, 100% 100%, 0 100%);
        color: #333;
        transform: translateX(110%); /* Fora da tela pela direita */
    }

    /* Classe que ativa a animação */
    #drawer_menu.active > a {
        transform: translateX(0);
        opacity: 1;
    }

    /* Delays para o efeito cascata (entrada) */
    #drawer_menu.active > a:nth-child(1) { transition-delay: 0.1s; }
    #drawer_menu.active > a:nth-child(2) { transition-delay: 0.15s; }
    #drawer_menu.active > a:nth-child(3) { transition-delay: 0.2s; }
    #drawer_menu.active > a:nth-child(4) { transition-delay: 0.25s; }
    #drawer_menu.active > a:nth-child(5) { transition-delay: 0.3s; }
    #drawer_menu.active > a:nth-child(6) { transition-delay: 0.35s; }

    .btn-close-drawer {
        margin-top: 40px;
        padding: 15px 40px;
        background: #fff;
        color: #000;
        border: none;
        border-radius: 50px;
        font-weight: 800;
        cursor: pointer;
        opacity: 0;
        transition: 0.5s;
    }
    #drawer_menu.active .btn-close-drawer { opacity: 1; transition-delay: 0.7s; }
#drawer_menu > a {
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
        width: 75%;
        width: 55%;
        background: linear-gradient(90deg, #154a8f 0%, #27f 100%);
        clip-path: polygon(0 0, 90% 0, 100% 50%, 100% 100%, 0 100%);
        transform: translateX(-110%);
        border-left: 5px solid #0df; /* "Faísca" lateral */
        box-shadow: 10px 0 20px rgba(34, 119, 255, 0.3);
    }

    /* Estilo "Lâmina" Direita (Cobre/Âmbar) */
    #drawer_menu > a:nth-child(odd) {
        place-self: end;
        width: 75%;
        width: 56%;
        background: linear-gradient(270deg, #ba2e11 0%, #ffab00 100%);
        clip-path: polygon(0% 0, 100% 0, 100% 100%, 10% 100%, 0 50%);
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

    /* Cascata de entrada */
    #drawer_menu.active > a:nth-child(1) { transition-delay: 0.1s; }
    #drawer_menu.active > a:nth-child(2) { transition-delay: 0.15s; }
    #drawer_menu.active > a:nth-child(3) { transition-delay: 0.2s; }
    #drawer_menu.active > a:nth-child(4) { transition-delay: 0.25s; }

    .btn-close-drawer {
        margin-top: 50px;
        background: transparent;
        color: white;
        border: 2px solid #ffcc00;
        padding: 12px 35px;
        border-radius: 5px;
        font-family: 'Montserrat';
        text-transform: uppercase;
        cursor: pointer;
        transition: 0.3s;
        opacity: 0;
    }
    #drawer_menu.active .btn-close-drawer { opacity: 1; transition-delay: 0.7s; }
    appbar header-area { cursor: pointer; } /* Garante o feedback de clique */
</style>

<appbar>
    <ui>
        <header-area id="appbar_back_zone">
</header-area>
        <title-area>
<!-- <img src="../assets/imgs/ea/ea-Name.png" style="height: 63%;"> -->
${logoText}
</title-area>
        <options-btn id="openMenu">☰</options-btn>
    </ui>
</appbar>

<div id="drawer_menu">
${appbarLinks
  .map((l) => `<a href="${l.url}" class="menu-block">${l.name}"</a>`)
  .join("")}
    <button class="btn-close-drawer" id="closeMenu">FECHAR</button>
</div>
`;

  body.insertAdjacentHTML("afterbegin", appBarTemplate);
  // INICIALIZA O BOTÃO DE VOLTAR NO ESPAÇO RESERVADO
  if (typeof initBackButton === "function") {
    initBackButton("#appbar_back_zone");
  }

  const drawer = document.getElementById("drawer_menu");
  const btnOpen = document.getElementById("openMenu");
  const btnClose = document.getElementById("closeMenu");

  const openDrawer = () => {
    drawer.style.display = "flex";
    // Pequeno timeout para o navegador processar o display:flex antes da animação
    setTimeout(() => {
      drawer.classList.add("active");
    }, 10);
  };

  const closeDrawer = () => {
    drawer.classList.remove("active");
    // Espera a animação de saída terminar (0.6s do último item + 0.4s de transição)
    setTimeout(() => {
      drawer.style.display = "none";
    }, 800);
  };

  btnOpen.on("click", openDrawer);
  btnClose.on("click", closeDrawer);

  // Fecha ao clicar em qualquer link dentro do menu
  const links = drawer.querySelectorAll("a");
  links.forEach((link) => {
    link.on("click", closeDrawer);
  });

  drawer.on("click", (e) => {
    if (e.target === drawer) closeDrawer();
  });
}

initAppBar();
