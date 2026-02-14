function initAppBar() {
  const body = document.body;

  // Detecta se estamos na raiz (index.html) ou em uma pasta (pages/)
  const isRoot = !window.location.pathname.includes("/pages/");
  const prefix = isRoot ? "./pages/" : "./";
  const rootPrefix = isRoot ? "./" : "../";

  // --- LÓGICA DE TÍTULO DINÂMICO ---
  // Verifica se existe uma configuração de título na página atual
  let customTitle = window.ea_config?.title || null;

  let finalLogoContent = "";

  if (customTitle) {
    // Se houver título customizado, usamos o template simplificado
    finalLogoContent = `
      <ea-text 
        font="GodOfThunder" 
        size="1.4rem"
        shadow-stroke="5px"
        color="#ffffff"
        shadow="var( --sv-sodalita )"
      >${customTitle}</ea-text>
    `;
  } else {
    // Se não houver, usamos o logo padrão estilizado "eletrica & art"
    finalLogoContent = `
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
  }

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

/* Estilo do VMenu na AppBar */
  #vmenu_container {
    position: relative;
    height: 100%; aspect-ratio: 1;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
  }
  #vmenu_dropdown {
    display: none;
    position: absolute;
    top: 60px; right: 10px;
    background: white;
    min-width: 180px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    flex-direction: column;
    overflow: hidden;
    z-index: 10000;
  }
  #vmenu_dropdown.active { display: flex; }
  .vmenu-item {
    padding: 15px;
    border: none; background: none;
    display: flex; align-items: center; gap: 12px;
    font-family: 'Poppins', sans-serif; font-size: 0.9rem;
    color: #333; text-align: left; width: 100%;
    cursor: pointer; transition: background 0.2s;
  }
  .vmenu-item:hover { background: #f5f5f5; }
</style>

<appbar class="no-print">
  <ui>
    <navigation-slot id="appbar_back_zone">
      <back-button></back-button>
    </navigation-slot>
    <main slot="title">
      ${finalLogoContent}
    </main>
    <actions-slot id="vmenu_container">
      <div style="font-size: 1.6rem; color: white;">⋮</div>
      <div id="vmenu_dropdown"></div>
    </actions-slot>
  </ui>
</appbar>
`;

  body.insertAdjacentHTML("afterbegin", appBarTemplate);

  const vmenuContainer = document.getElementById("vmenu_container");
  const vmenuDropdown = document.getElementById("vmenu_dropdown");

  // Fecha o menu ao clicar fora
  document.addEventListener("click", (e) => {
    if (!vmenuContainer.contains(e.target))
      vmenuDropdown.classList.remove("active");
  });

  // Função Global para definir as ações
  window.setAppBarActions = function (actions) {
    vmenuDropdown.innerHTML = actions
      .map(
        (act, index) => `
      <button class="vmenu-item" id="vact-${index}">
        <span>${act.icon}</span> ${act.label}
      </button>
    `,
      )
      .join("");

    vmenuContainer.onclick = (e) => {
      e.stopPropagation();
      vmenuDropdown.classList.toggle("active");
    };

    // Atribui os eventos de clique
    actions.forEach((act, index) => {
      document.getElementById(`vact-${index}`).onclick = () => {
        act.action();
        vmenuDropdown.classList.remove("active");
      };
    });
  };

  if (typeof initBackButton === "function") {
    initBackButton("#appbar_back_zone");
  }
}
initAppBar();
