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
    appbar title-area { background: transparent; flex: 1; display: flex; align-items: center; padding: 0 15px; }
    appbar options-btn { 
        background: #905; height: 100%; aspect-ratio: 1; 
        display: flex; align-items: center; justify-content: center; 
        cursor: pointer; color: white; font-size: 1.5rem;
    }

    /* Drawer Menu */
    #drawer_menu {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
        display: none; /* Controlado pelo JS */
        z-index: 2000;
        flex-direction: column;
        align-items: center;
        justify-content: center;
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
    #drawer_menu.active > a:nth-child(2) { transition-delay: 0.2s; }
    #drawer_menu.active > a:nth-child(3) { transition-delay: 0.3s; }
    #drawer_menu.active > a:nth-child(4) { transition-delay: 0.4s; }
    #drawer_menu.active > a:nth-child(5) { transition-delay: 0.5s; }
    #drawer_menu.active > a:nth-child(6) { transition-delay: 0.6s; }

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
</style>

<appbar>
    <ui>
        <header-area><img src="../assets/eaLogos/ea300.png" style="height: 80%; border-radius: 50%;"></header-area>
        <title-area><img src="../assets/eaLogos/ea-Name.png" style="height: 40%;"></title-area>
        <options-btn id="openMenu">☰</options-btn>
    </ui>
</appbar>

<div id="drawer_menu">
    <a href="../index.html" class="menu-block">🏠 Home</a>
    <a href="captura.html" class="menu-block">✍️ Novo Orçamento</a>
    <a href="dashboard.html" class="menu-block">📊 Dashboard</a>
    <a href="#" class="menu-block">📊 teste 1</a>
    <a href="#" class="menu-block">📊 teste 2</a>
    <a href="#" class="menu-block">📊 teste 3</a>
    <button class="btn-close-drawer" id="closeMenu">FECHAR</button>
</div>
`;

function initAppBar() {
  const body = document.body;
  body.insertAdjacentHTML("afterbegin", appBarTemplate);

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
