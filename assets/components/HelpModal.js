const helpModalStyle = `
<style>
  #help_modal_overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.7); display: none; z-index: 9999;
    align-items: center; justify-content: center; backdrop-filter: blur(4px);
  }
  .help-modal-card {
    background: white; width: 90%; max-width: 500px; border-radius: 15px;
    overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    font-family: 'Poppins', sans-serif;
  }
  .help-modal-header {
    background: var(--sv-sombra-azul); color: white; padding: 15px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .help-modal-body { padding: 20px; color: #333; line-height: 1.6; }
  .help-item { margin-bottom: 15px; display: flex; gap: 10px; align-items: flex-start; }
  .help-key { 
    background: #eee; padding: 2px 8px; border-radius: 4px; 
    font-family: monospace; font-weight: bold; color: #27f; border: 1px solid #ddd;
  }
  .btn-close-modal { cursor: pointer; font-size: 1.5rem; }
</style>
`;

function initHelpSystem() {
  if (document.getElementById("help_modal_overlay")) return;

  document.head.insertAdjacentHTML("beforeend", helpModalStyle);

  const modalHtml = `
    <div id="help_modal_overlay">
      <div class="help-modal-card">
        <div class="help-modal-header">
          <strong>Guia de Formatação</strong>
          <span class="btn-close-modal" id="close_help">×</span>
        </div>
        <div class="help-modal-body">
          <div class="help-item">
            <span class="help-key">-</span>
            <t>Inicie a linha com hífen para criar <b>Listas de Itens</b>.</t>
          </div>
          <div class="help-item">
            <span class="help-key">></span>
            <t>Inicie com sinal de maior para <b>Texto de Observação</b> (Azul).</t>
          </div>
          <div class="help-item">
            <span class="help-key">#</span>
            <t>Inicie com hashtag para criar um <b>Subtítulo Interno</b>.</t>
          </div>
          <div class="help-item">
            <span class="help-key">---</span>
            <t>Use três hifens sozinhos em uma linha para <b>Quebra de Página</b>.</t>
          </div>
          <p style="font-size: 0.8em; color: #777; border-top: 1px solid #eee; pt: 10px;">
            Dica: Aperte Enter para separar os comandos por linha.
          </p>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const overlay = document.getElementById("help_modal_overlay");

  // Fecha ao clicar no X ou fora do card
  document.getElementById("close_help").on("click", () => overlay.fadeOut());
  overlay.on("click", (e) => {
    if (e.target === overlay) overlay.fadeOut();
  });
}

// Função global para ser chamada pelo clique na tag "ajuda"
function showHelp() {
  initHelpSystem();
  document.getElementById("help_modal_overlay").fadeIn().css("display", "flex");
}
