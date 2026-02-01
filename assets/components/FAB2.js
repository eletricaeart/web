const fabStyle = `
<style>
    .fab-container {
        position: fixed;
        bottom: 30px;
        right: 30px;
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        gap: 15px;
        gap: 25px;
        z-index: 3000;
    }
    .fab {
        width: 65px;
        height: 60px;
        background-color: #ffcc00;
        color: #333 !important;
        border-radius: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border: none;
    }
    .fab.active { transform: rotate(45deg); background-color: #333; color: #ffcc00 !important; }

    /* Opções Expandidas */
    .fab-options {
        display: none;
        flex-direction: column-reverse;
        gap: 1.2rem;
        align-items: flex-end;
        transition: 0.3s;
    }
    .fab-option-item {
        display: flex;
        align-items: center;
        /*gap: 10px;*/
        opacity: 0;
        transform: translateY(20px);
        transition: 0.3s;
    }
    .fab-option-item.show { opacity: 1; transform: translateY(0); }
    
    .fab-label {
        background: #566c9b;
        background: #00559c;
        background: #e5e5e5;
        color: white;
        color: #333;
        padding: 5px 12px;
        border-radius: 8px 0px 0 8px;
        font-size: 1rem;
        font-family: 'Poppins';
        white-space: nowrap;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        box-shadow: 0 0 0 10px #fff;
        filter: drop-shadow(-4px 6px 6px #0003);
        z-index: 1;
    }
    .fab-mini {
        width: 45px;
        width: 60px;
        height: 60px;
        background: #fff;
        /*border: 2px solid #ffcc00;*/
        border-radius: 5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 7px #0003;
        box-shadow: 0 0 0 5px #0075bd;
        filter: drop-shadow(2px 4px 6px #0005);
        z-index: 2;
    }
    .fab-mini > img {
      width: 40px !important;
      height: 40px !important;
      aspect-ratio: 1 !important;
    }
</style>
`;

/**
 * @param {Object|Array} config - Se objeto {icon, action}, ação direta. Se Array, expande menu.
 */
function createFAB(config) {
  document.head.insertAdjacentHTML("beforeend", fabStyle);

  const isArray = Array.isArray(config);
  const mainIcon = isArray ? "+" : config.icon;

  let html = `<div class="fab-container">
                    <button class="fab" id="main_fab">${mainIcon}</button>
                    ${isArray ? '<div class="fab-options" id="fab_options"></div>' : ""}
                </div>`;

  document.body.insertAdjacentHTML("beforeend", html);

  const mainBtn = document.getElementById("main_fab");

  if (!isArray) {
    // Caso de ação única
    mainBtn.on("click", () => {
      if (typeof config.action === "function") config.action();
      else window.location.href = config.action;
    });
  } else {
    // Caso de múltiplas opções
    const optionsContainer = document.getElementById("fab_options");

    config.forEach((opt, i) => {
      const item = document.createElement("div");
      item.className = "fab-option-item";
      item.innerHTML = `
                <span class="fab-label">${opt.label}</span>
                <button class="fab-mini">${opt.icon}</button>
            `;

      item.on("click", () => {
        if (typeof opt.action === "function") opt.action();
        else window.location.href = opt.action;
        toggleFab();
      });

      optionsContainer.appendChild(item);
    });

    const toggleFab = () => {
      const isOpen = mainBtn.classList.toggle("active");
      optionsContainer.style.display = isOpen ? "flex" : "none";

      const items = optionsContainer.querySelectorAll(".fab-option-item");
      items.forEach((el, index) => {
        setTimeout(() => {
          el.classList.toggle("show", isOpen);
        }, index * 50); // Efeito cascata
      });
    };

    mainBtn.on("click", toggleFab);
  }
}
