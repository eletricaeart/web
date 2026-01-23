const fabStyle = `
<style>
    .fab-container {
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 1500;
    }
    .fab {
        width: 60px;
        height: 60px;
        background-color: #ffcc00;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
        font-size: 30px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: 0.3s;
        border: none;
    }
    .fab:hover { transform: scale(1.1); background-color: #e6b800; }
    .fab:active { transform: scale(0.9); }
</style>
`;

function createFAB(icon = "+", actionUrl = "captura.html") {
  document.head.insertAdjacentHTML("beforeend", fabStyle);

  const fabHtml = `
        <div class="fab-container">
            <button class="fab" onclick="window.location.href='${actionUrl}'">${icon}</button>
        </div>
    `;

  document.body.insertAdjacentHTML("beforeend", fabHtml);
}

// Inicializa o FAB apontando para a página de captura
createFAB("+", "captura.html");
