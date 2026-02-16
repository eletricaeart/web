const fabStyle = `
<style>
    .fab-container {
        position: fixed;
        bottom: 85px; /* Elevado para ficar acima da BottomNavBar */
        right: 20px;
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        gap: 25px;
        z-index: 9000; /* À frente da Navbar */
        transition: bottom 0.3s ease;
    }
    .fab-container.shift-down { bottom: 20px; } /* Desce quando o teclado abre */

    .fab {
        width: 65px; height: 60px;
        background-color: #ffcc00; color: #333 !important;
        border-radius: 1.2rem; display: flex;
        align-items: center; justify-content: center;
        font-size: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        cursor: pointer; transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border: none;
    }
    .fab.active { transform: rotate(45deg); background-color: #333; color: #ffcc00 !important; }

    .fab-options {
        display: none; flex-direction: column-reverse;
        gap: 1.2rem; align-items: flex-end;
    }
    .fab-option-item {
        display: flex; align-items: center;
        opacity: 0; transform: translateY(20px);
        transition: 0.3s; cursor: pointer;
    }
    .fab-option-item.show { opacity: 1; transform: translateY(0); }
    
    .fab-label {
        background: var(--card-lv3); color: white;
        padding: 5px 12px; border-radius: 8px 0 0 8px;
        font-size: 1rem; font-family: 'Poppins';
        margin-right: -5px; z-index: 1;
        box-shadow: 0 0 0 8px var(--card-lv1);
    }
    .fab-mini {
        width: 60px; height: 60px;
        background: #a7ebe5; border-radius: 5rem;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 0 0 8px var(--card-lv1);
        z-index: 2; border: none;
    }

    /* Efeito de Desfoque */
    .fab-blur-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.3); backdrop-filter: blur(5px);
        display: none; z-index: 8500; opacity: 0; transition: 0.3s;
    }
    .fab-blur-overlay.active { display: block; opacity: 1; }
</style>
`;

function createFAB(config) {
  document.head.insertAdjacentHTML("beforeend", fabStyle);

  const isArray = Array.isArray(config);
  const mainIcon = isArray ? "+" : config.icon;

  let html = `
        <div class="fab-blur-overlay" id="fab_blur"></div>
        <div class="fab-container">
            <button class="fab" id="main_fab">${mainIcon}</button>
            ${isArray ? '<div class="fab-options" id="fab_options"></div>' : ""}
        </div>`;

  document.body.insertAdjacentHTML("beforeend", html);

  const mainBtn = document.getElementById("main_fab");
  const container = document.querySelector(".fab-container");
  const blurOverlay = document.getElementById("fab_blur");
  const initialHeight = window.innerHeight;

  // Ajuste para o Teclado
  window.addEventListener("resize", () => {
    if (window.innerHeight < initialHeight * 0.8)
      container.classList.add("shift-down");
    else container.classList.remove("shift-down");
  });

  if (!isArray) {
    mainBtn.onclick = () => {
      if (typeof config.action === "function") config.action();
      else window.location.href = config.action;
    };
  } else {
    const optionsContainer = document.getElementById("fab_options");

    config.forEach((opt, i) => {
      const item = document.createElement("div");
      item.className = "fab-option-item";
      item.innerHTML = `<span class="fab-label">${opt.label}</span><button class="fab-mini">${opt.icon}</button>`;
      item.onclick = () => {
        if (typeof opt.action === "function") opt.action();
        else window.location.href = opt.action;
        toggleFab();
      };
      optionsContainer.appendChild(item);
    });

    const toggleFab = () => {
      const isOpen = mainBtn.classList.toggle("active");
      optionsContainer.style.display = isOpen ? "flex" : "none";
      blurOverlay.classList.toggle("active", isOpen);

      const items = optionsContainer.querySelectorAll(".fab-option-item");
      items.forEach((el, index) => {
        setTimeout(() => el.classList.toggle("show", isOpen), index * 50);
      });
    };

    mainBtn.onclick = toggleFab;
    blurOverlay.onclick = toggleFab;
  }
}
