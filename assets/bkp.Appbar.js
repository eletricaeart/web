const appBarTemplate = `
<style>
    appbar {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 72px;
        background: var(--card-lv1);
        box-shadow: var(--appbar-shadow);
        position: sticky;
        top: 0;
        z-index: 1000;
    }
    appbar > ui { display: flex; flex-direction: row; width: 100%; height: 100%; }
    
    /* Parte 1: Logo/Espaço Esquerdo */
    appbar header-area { background-color: #ffab00; width: 20%; height: 100%; display: flex; align-items: center; justify-content: center; }
    
    /* Parte 2: Centro (Título/Nome) */
    appbar title-area { background: transparent; flex: 1; display: flex; align-items: center; padding: 0 15px; }
    
    /* Parte 3: Botão de Opções */
    appbar options-btn { 
        background: #905; 
        height: 100%; 
        aspect-ratio: 1; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        cursor: pointer;
        color: white;
        font-size: 1.5rem;
    }

    /* Drawer (Menu Semi-transparente) */
    #drawer_menu {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        display: none;
        z-index: 2000;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }

#drawer_menu > a:nth-child(even) {
    background: #27f;
    width: 50%;
    place-self: start;
    clip-path: polygon(0 0, calc( 100% - 25% ) 0, 100% 100%,0 100%);
}

#drawer_menu > a:nth-child(odd) {
    background: #ffab00;
    width: 50%;
    place-self: end;
    clip-path: polygon(25% 0, 100% 0, 100% 100%,0 100%);
}
#drawer_menu > a {
    height: 130px;
    display: grid;
    place-items: center;
    font-size: 1.6rem;
    max-width: 100%;
}

    .menu-block {
        width: 80%;
        max-width: 400px;
        padding: 20px;
        background: white;
        color: #333;
        text-align: center;
        border-radius: 12px;
        text-decoration: none;
        font-weight: bold;
        font-family: 'Poppins', sans-serif;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        transition: 0.3s;
    }
    .menu-block:hover { background: #ffcc00; transform: scale(1.05); }
</style>

<appbar>
    <ui>
        <header-area>
             <img src="../assets/eaLogos/ea300.png" style="height: 80%; border-radius: 50%;">
        </header-area>
        <title-area>
             <img src="../assets/eaLogos/ea-Name.png" style="height: 40%;">
        </title-area>
        <options-btn id="openMenu">☰</options-btn>
    </ui>
</appbar>

<div id="drawer_menu">
    <a href="../index.html" class="menu-block">🏠 Home</a>
    <a href="captura.html" class="menu-block">✍️ Criar Novo Orçamento</a>
    <a href="dashboard.html" class="menu-block">📊 Dashboard</a>
    <a href="#" class="menu-block">📊 teste</a>
    <a href="#" class="menu-block">📊 teste</a>
    <a href="#" class="menu-block">📊 teste</a>
    <button class="menu-block" style="background: #333; color: white; border: none;" id="closeMenu">Fechar</button>
</div>
`;

function initAppBar() {
  const body = document.body;
  body.insertAdjacentHTML("afterbegin", appBarTemplate);

  const drawer = document.getElementById("drawer_menu");
  const btnOpen = document.getElementById("openMenu");
  const btnClose = document.getElementById("closeMenu");

  btnOpen.on("click", () => (drawer.style.display = "flex"));
  btnClose.on("click", () => (drawer.style.display = "none"));

  // Fecha ao clicar no fundo
  drawer.on("click", (e) => {
    if (e.target === drawer) drawer.style.display = "none";
  });
}

initAppBar();
