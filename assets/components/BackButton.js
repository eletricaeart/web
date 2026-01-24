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
    /* Seta estilo Android Material */
    .arrow-back {
        width: 24px;
        height: 24px;
        fill: white;
    }
</style>
`;

function initBackButton(target = "header-area") {
  const parent = document.querySelector(target);
  if (!parent) return;

  document.head.insertAdjacentHTML("beforeend", backButtonStyle);

  const btnHtml = `
        <back-btn id="btn_global_back" title="Voltar">
            <svg class="arrow-back" viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
        </back-btn>
    `;

  parent.innerHTML = btnHtml;

  document.getElementById("btn_global_back").on("click", () => {
    // Se houver histórico anterior no mesmo domínio, volta.
    // Caso contrário, vai para a index.
    if (document.referrer.indexOf(window.location.host) !== -1) {
      window.history.back();
    } else {
      const isRoot = !window.location.pathname.includes("/pages/");
      window.location.href = isRoot ? "./index.html" : "../index.html";
    }
  });
}
